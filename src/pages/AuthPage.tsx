import type { AuthError } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import { Button } from "../components/Button/Button";
import { Dialog } from "../components/Dialog/Dialog";
import { SigIn } from "../features/auth/components/SignIn/SignIn";
import { SignUp } from "../features/auth/components/SignUp/SignUp";
import { authErrors } from "../features/auth/config";
import { resetPassword } from "../features/auth/services/auth";

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
        setError(null);
    }

    const handlePasswordReset = async (email: string) => {
        await resetPassword(email);
        if (error) setError(error);
        dialogRef.current?.close();
    }

    return (
        <main className="flex flex-col w-full m-auto items-center pb-5">
            {login && <>
                <SigIn onError={handleError} onEmailChange={setEmail} />
            </>}
            {!login && <>
                <SignUp onError={handleError} />
            </>}
            <Button style="tertiary" onClick={() => setLogin(!login)}>
                {login ? "Create account" : "I already have an account"}
            </Button>
            <Dialog ref={dialogRef} style="error" close={handleClose}>
                <p>{error}</p>
                <div className="flex gap-[5px] text-end flex-row-reverse">
                    <Button style="secondary" className="border-white text-txt-main bg-rgba-dark" onClick={handleClose}>Try again</Button>
                    <Button style="tertiary" className="text-txt-main" onClick={() => handlePasswordReset(email)}>Reset password</Button>
                </div>
            </Dialog>
        </main>
    )
}