import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Header } from "../../components/Header/Header";
import { useAuth } from "../auth/hooks/useAuth";
import { FavoritesSection } from "./components/FavoritesSection/FavoritesSection";
import { GreetingsSection } from "./components/GreetingsSection/GreetingsSection";
import { RollerbladerProfileSection } from "./components/RollerbladerProfileSection/RollerbladerProfileSection";

export function ProfilePage() {
    const { profile, loading } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!loading && profile && !profile.home_location_name) navigate("/onboarding")
    }, [loading, profile, navigate]);

    if (!profile) return;

    return (
        <>
            <Header />
            <main className="w-full h-full place-content-center xl:px-4">
                <section className="grid w-full lg:grid-cols-2 h-full">
                    <article className="flex gap-3 flex-col p-2 my-auto relative w-full h-fit">
                        <GreetingsSection profile={profile} />
                        <RollerbladerProfileSection />
                    </article>
                    <article className="flex gap-3 flex-col p-2 w-full">
                        <FavoritesSection />
                    </article>
                </section>
            </main>
        </>
    )
}