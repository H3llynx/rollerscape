import type { AuthError } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
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
    const [email, setEmail] = useState<string>("");
    const dialogRef = useRef<HTMLDialogElement>(null);

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
        setEmail("");
        setError(null);
    }

    const handlePasswordReset = async (email: string) => {
        const { error: resetError } = await resetPassword(email);
        if (resetError) setError(error);
        dialogRef.current?.close();
        setEmail("");
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
                <Dialog ref={dialogRef} style={error ? "error" : "default"} close={handleClose}>
                    {!error && <div className="text-base flex flex-col gap-1">
                        <Input
                            label="Email address:"
                            type="text"
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Button style="primary" onClick={() => handlePasswordReset(email)}>Reset password</Button>
                    </div>}
                    {error &&
                        <>
                            <p className="mt-1">{error}</p>
                            <div className="flex gap-[5px] ml-auto">
                                <Button style="secondary" className="border-white text-text" onClick={handleClose}>Try again</Button>
                            </div>
                        </>
                    }
                </Dialog>
            </main>
        </>
    )
}