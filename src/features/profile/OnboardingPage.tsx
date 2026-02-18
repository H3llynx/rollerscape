import { useNavigate } from "react-router";
import { Header } from "../../components/Header/Header";
import { LocationRequest } from "./components/LocationRequest/LocationRequest";

export function OnboardingPage() {
    const navigate = useNavigate();
    const handleSuccess = () => navigate("/profile", { replace: true });

    return (
        <>
            <Header />
            <section className="standard-width m-auto flex flex-col gap-2 items-center pb-3 text-center">
                <LocationRequest onSuccess={handleSuccess} />
            </section>
        </>
    )
}