import { useForm, } from 'react-hook-form';
import { useNavigate } from 'react-router';
import Google from "../../../../assets/svg/google.svg?react";
import { Button } from "../../../../components/Button/Button";
import { Input } from "../../../../components/Input/Input";
import { Loading } from '../../../../components/Loading/Loading';
import { loginWithGoogle, signIn } from "../../services/auth";
import type { Credentials } from '../../types';
import "./SignIn.css";

export function SigIn() {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<Credentials>();
    const navigate = useNavigate();

    const loginWithPassword = async ({ email, password }: Credentials) => {
        const { error } = await signIn({ email, password });
        if (error) alert("Ta mère!");
        else navigate("/");
    }

    return (
        <div className="flex flex-col w-fit gap-1">
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
                <Google aria-hidden="true" />Sign In With Google
            </Button>
        </div>
    )
}