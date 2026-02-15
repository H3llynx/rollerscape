import type { AuthError } from '@supabase/supabase-js';
import { useEffect } from 'react';
import { useForm, } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Button } from "../../../../components/Button/Button";
import { Input } from "../../../../components/Input/Input";
import { Loading } from "../../../../components/Loading/Loading";
import type { Credentials } from "../../../../types/user_types";
import { redirectURL } from '../../config';
import { useAuth } from '../../hooks/useAuth';
import { signUp } from "../../services/auth";

export function SignUp({ onError }: { onError: (error: AuthError) => void }) {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<Credentials>();
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate(`/${redirectURL}`);
        }
    }, [user, navigate]);

    const createAccount = async ({ name, email, password }: Credentials) => {
        const { error } = await signUp({ name, email, password });
        if (error) onError(error);
    };

    return (
        <section className="standard-width">
            <form
                onSubmit={handleSubmit(createAccount)}
                className="flex flex-col gap-1">
                <Input
                    label="What cool name should we call you?"
                    type="text"
                    id="name"
                    {...register("name")}
                    required
                />
                <Input
                    label="Enter your email address:"
                    type="text"
                    id="email"
                    {...register("email")}
                    required
                />
                <Input
                    label="Pick a password:"
                    type="password"
                    id="password"
                    {...register("password")}
                    required
                />
                {isSubmitting ? <Loading /> :
                    <Button>Create account</Button>
                }
            </form>
        </section>
    )
}