import type { AuthError } from '@supabase/supabase-js';
import { useEffect } from 'react';
import { useForm, } from 'react-hook-form';
import { useNavigate } from 'react-router';
import Google from "../../../../assets/svg/google.svg?react";
import { Button } from "../../../../components/Button/Button";
import { Input } from "../../../../components/Input/Input";
import { Loading } from '../../../../components/Loading/Loading';
import type { Credentials } from '../../../../types/user_types';
import { redirectURL } from '../../config';
import { useAuth } from '../../hooks/useAuth';
import { loginWithGoogle, signIn } from "../../services/auth";

type SignIn = {
    onError: (error: AuthError) => void;
    onEmailChange: (email: string) => void;
}
export function SigIn({ onError, onEmailChange }: SignIn) {
    const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm<Credentials>();
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate(`/${redirectURL}`);
        }
    }, [user, navigate]);

    const emailValue = watch("email");
    useEffect(() => {
        onEmailChange(emailValue);
    }, [emailValue, onEmailChange]);

    const loginWithPassword = async ({ email, password }: Credentials) => {
        const { error } = await signIn({ email, password });
        if (error) onError(error);
    }

    return (
        <section className="flex flex-col gap-1 standard-width">
            <form
                onSubmit={handleSubmit((loginWithPassword))}
                className="flex flex-col gap-1">
                <Input
                    label="Email address:"
                    type="text"
                    id="email"
                    {...register("email")}
                    required
                />
                <Input
                    label="Password:"
                    type="password"
                    id="password"
                    {...register("password")}
                    required
                />
                {isSubmitting ? <Loading /> :
                    <Button>Log in</Button>
                }
            </form>
            <p className="separator">OR</p>
            <Button style="secondary" onClick={loginWithGoogle}>
                <Google aria-hidden />Sign In With Google
            </Button>
        </section>
    )
}