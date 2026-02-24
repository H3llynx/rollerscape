import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../components/Button/Button";
import { Input } from "../../../../components/Input/Input";
import { Loading } from "../../../../components/Loading/Loading";
import { databases } from "../../../../config/databases";
import { updateData } from "../../../../services/data";
import { useAuth } from "../../../auth/hooks/useAuth";

type NameChangeForm = {
    onSuccess: () => void;
}

export function NameChangeForm({ onSuccess }: NameChangeForm) {
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<{ name: string }>();
    const [error, setError] = useState<boolean>(false);
    const { profile, setProfile } = useAuth();

    const updateName = async ({ name }: { name: string }) => {
        if (!profile) return;
        const { error } = await updateData({ id: profile.id, name }, databases.profiles);
        if (error) setError(true);
        else {
            onSuccess()
            setProfile({ ...profile, name });
            reset();
        }
    }

    return (
        <form
            onSubmit={handleSubmit(updateName)}
            className="w-full flex flex-col gap-1.5 text-base text-left">
            <Input
                label="What cool name should we call you?"
                type="text"
                id="name"
                {...register("name", { onChange: () => setError(false) })}
            />
            {isSubmitting ? <Loading /> :
                <Button>Update name</Button>
            }
            {error && <p className="error">Sorry, the update did not work. Try again later.</p>}
        </form>
    )
}