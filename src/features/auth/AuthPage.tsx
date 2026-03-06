import type { AuthError } from "@supabase/supabase-js";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../components/Button/Button";
import { Dialog } from "../../components/Dialog/Dialog";
import { Header } from "../../components/Header/Header";
import { Input } from "../../components/Input/Input";
import { authErrors } from "../../config/errors";
import { resetPassword } from "../../services/auth";
import { SigIn } from "./components/SignIn/SignIn";
import { SignUp } from "./components/SignUp/SignUp";

export function AuthPage() {
    const [login, setLogin] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const { register, handleSubmit, reset, getValues, formState: { isSubmitted } } = useForm<{ email: string }>();

    useEffect(() => {
        if (error) {
            dialogRef.current?.showModal();
        }
    }, [error])

    const handleError = (sbError: AuthError) => {
        if (!sbError) setError(null);
        else {
            const customError = authErrors[sbError.code as keyof typeof authErrors] || authErrors.generic
            setError(customError);
        }
    }

    const handleClose = () => {
        dialogRef.current?.close();
        setError(null);
        reset();
    }

    const handlePasswordReset = async ({ email }: { email: string }) => {
        const { error: resetError } = await resetPassword(email);
        if (resetError) {
            setError(resetError.message);
            return;
        }
        setError(null);
    }

    return (
        <>
            <Header />
            <main className="flex flex-col items-center pb-5 w-full my-auto gap-1">
                {login && <>
                    <SigIn onError={handleError} />
                </>}
                {!login && <>
                    <SignUp onError={handleError} />
                </>}
                <div className="flex gap-0.5">
                    {login && <Button style="tertiary" className="text-text" onClick={() => dialogRef.current?.showModal()}>Reset password</Button>}
                    <Button style="tertiary" className="md:pr-1" onClick={() => setLogin(!login)}>
                        {login ? "Create account" : "I already have an account"}
                    </Button>
                </div>
            </main>
            <Dialog ref={dialogRef} style={error ? "error" : "default"} close={handleClose}>
                {!error &&
                    <>
                        {!isSubmitted &&
                            <form
                                aria-label="Reset password"
                                onSubmit={handleSubmit(handlePasswordReset)}>
                                <Input
                                    label="Email address:"
                                    type="email"
                                    id="reset-email"
                                    {...register("email")}
                                    required
                                />
                                <Button style="primary">Reset password</Button>
                            </form>
                        }
                        {isSubmitted &&
                            <>
                                <p>Check your inbox!
                                    We've sent a password reset link to <i className="text-text-secondary">{getValues("email")}</i>. If you don't see it, check your spam folder.</p>
                                <Button style="secondary" className="border-white text-text ml-auto" onClick={handleClose}><Check aria-hidden />Cool</Button>
                            </>
                        }
                    </>
                }
                {error &&
                    <>
                        <p className="mt-1">{error}</p>
                        <div className="flex gap-[5px] ml-auto">
                            <Button style="secondary" className="border-white text-text" onClick={handleClose}>Try again</Button>
                        </div>
                    </>
                }
            </Dialog>
        </>
    )
}