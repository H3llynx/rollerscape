import type { AuthError } from '@supabase/supabase-js';
import { useEffect } from 'react';
import { useForm, } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import Google from "../../../../assets/svg/google.svg?react";
import { Button } from "../../../../components/Button/Button";
import { Input } from "../../../../components/Input/Input";
import { Loading } from '../../../../components/Loading/Loading';
import { loginWithGoogle, signIn } from '../../../../services/auth';
import type { Credentials } from '../../../../types/user_types';
import { useAuth } from '../../hooks/useAuth';

type SignIn = {
    onError: (error: AuthError) => void;
    onEmailChange: (email: string) => void;
}
export function SigIn({ onError, onEmailChange }: SignIn) {
    const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm<Credentials>();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const redirectURL = location.state?.from?.pathname ?? "/";

    useEffect(() => {
        if (user) {
            navigate(redirectURL, { replace: true });
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
            <p className="separator md:pr-1">OR</p>
            <Button style="secondary" className="md:mr-1" onClick={() => loginWithGoogle({ redirectURL })}>
                <Google aria-hidden />Sign In With Google
            </Button>
        </section>
    )
}