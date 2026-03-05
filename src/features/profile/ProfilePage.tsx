import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Header } from "../../components/Header/Header";
import { useAuth } from "../auth/hooks/useAuth";
import { useSpots } from "../map/hooks/useContexts";
import { FavoritesSection } from "./components/FavoritesSection/FavoritesSection";
import { GreetingsSection } from "./components/GreetingsSection/GreetingsSection";
import { ReviewsSection } from "./components/ReviewsSection/ReviewsSection";
import { RollerbladerProfileSection } from "./components/RollerbladerProfileSection/RollerbladerProfileSection";
import { SubmittedSpotsSection } from "./components/SubmittedSpotsSection/SubmittedSpotsSection";

export function ProfilePage() {
    const { profile, loading } = useAuth();
    const { selectedSpot, setSelectedSpot } = useSpots();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && profile && !profile.home_location_name) navigate("/onboarding")
    }, [loading, profile, navigate]);

    useEffect(() => {
        if (selectedSpot) setSelectedSpot(null);
    }, []);

    if (!profile) return;

    return (
        <>
            {profile.home_location_name &&
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
                                <ReviewsSection />
                                <SubmittedSpotsSection />
                            </article>
                        </section>
                    </main>
                </>
            }
        </>
    )
}