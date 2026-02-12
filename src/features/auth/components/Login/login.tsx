import Google from "../../../../assets/svg/google.svg?react";
import { Button } from "../../../../components/Button/Button";
import { Input } from "../../../../components/Input/Input";
import { loginWithGoogle } from "../../services/auth";
import "./Login.css";

export function Login() {
    return (
        <div className="flex flex-col w-fit gap-1">
            <form className="flex flex-col gap-1">
                <Input
                    label="What cool name should we call you?"
                    type="text"
                    id="name"
                />
                <Input
                    label="Enter your email address:"
                    type="text"
                    id="email"
                />
                <Input
                    label="Pick a password:"
                    type="password"
                    id="password"
                />
                <Button>Log in</Button>
            </form>
            <p className="separator">OR</p>
            <Button color="secondary" onClick={loginWithGoogle}>
                <Google aria-hidden="true" />Sign In With Google
            </Button>
        </div>
    )
}