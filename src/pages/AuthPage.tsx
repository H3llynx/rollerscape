import { useState } from "react";
import { Button } from "../components/Button/Button";
import { SigIn } from "../features/auth/components/SignIn/SignIn";
import { SignUp } from "../features/auth/components/SignUp/SignUp";

export function AuthPage() {
    const [login, setLogin] = useState<boolean>(true);

    return (
        <main className="max-w-[1400px] flex flex-col my-auto pb-5">
            {login && <>
                <SigIn />
            </>}
            {!login && <>
                <SignUp />
            </>}
            <Button style="tertiary" onClick={() => setLogin(!login)}>
                {login ? "Register" : "I already have an account"}
            </Button>
        </main>
    )
}