import { Login } from "../features/auth/components/Login/login";

export function AuthPage() {
    return (
        <section className="max-w-[1400px] h-dvh flex flex-col justify-center items-center">
            <Login />
        </section>
    )
}