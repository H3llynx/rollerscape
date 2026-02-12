import Google from "../../../../assets/svg/google.svg?react";
import { Button } from "../../../../components/Button/Button";
import { loginWithGoogle } from "../../services/auth";

export function Login() {
    return (
        <Button color="secondary" onClick={loginWithGoogle}><Google aria-hidden="true" />Sign In With Google</Button>
    )
}