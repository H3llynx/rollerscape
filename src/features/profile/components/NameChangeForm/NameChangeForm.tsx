import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../components/Button/Button";
import { Input } from "../../../../components/Input/Input";
import { Loading } from "../../../../components/Loading/Loading";
import { databases } from "../../../../config/databases";
import { udpdateError } from "../../../../config/errors";
import { updateData } from "../../../../services/data";
import type { FormProps } from "../../../../types/other_reusable_types";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useSpots } from "../../../map/hooks/useSpots";

export function NameChangeForm({ onSuccess }: FormProps) {
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<{ name: string }>();
    const [error, setError] = useState<boolean>(false);
    const { profile, setProfile } = useAuth();
    const { loadSpots } = useSpots();

    if (!profile) return;

    const updateName = async ({ name }: { name: string }) => {
        const { error } = await updateData({ id: profile.id, name }, databases.profiles);
        if (error) {
            console.log(error.code)
            setError(true);
            return;
        }
        onSuccess()
        setProfile({ ...profile, name });
        await loadSpots();
        reset();
    }

    return (
        <form
            onSubmit={handleSubmit(updateName)}
            className="w-full flex flex-col gap-1.5 text-base text-left">
            <Input
                label="What cool name should we call you?"
                type="text"
                id="name"
                placeholder={profile.name}
                {...register("name", { onChange: () => setError(false) })}
            />
            {isSubmitting ? <Loading /> :
                <Button>Update name</Button>
            }
            {error && <p className="error">{udpdateError}</p>}
        </form>
    )
}