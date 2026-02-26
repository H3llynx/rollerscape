import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Header } from "../../components/Header/Header";
import { useAuth } from "../auth/hooks/useAuth";
import { useSpots } from "../map/hooks/useSpots";
import { FavoritesSection } from "./components/FavoritesSection/FavoritesSection";
import { GreetingsSection } from "./components/GreetingsSection/GreetingsSection";
import { RollerbladerProfileSection } from "./components/RollerbladerProfileSection/RollerbladerProfileSection";

export function ProfilePage() {
    const { profile, loading } = useAuth();
    const { spots } = useSpots();
    if (!profile) return;

    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && profile && !profile.home_location_name) navigate("/onboarding")
    }, [loading, profile, navigate]);

    return (
        <>
            <Header />
            <main className="w-full h-full place-content-center">
                <section className="grid w-full md:grid-cols-2 h-full">
                    <article className="flex gap-3 flex-col p-2 lg:px-4 my-auto relative w-full h-fit 2xl:items-center">
                        <GreetingsSection profile={profile} />
                        <RollerbladerProfileSection />
                    </article>
                    <article className="flex gap-3 flex-col p-2 lg:px-4 w-full">
                        <FavoritesSection />
                    </article>
                </section>
            </main>
        </>
    )
}