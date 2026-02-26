import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Header } from "../../components/Header/Header";
import { RiderPreferences } from "../../features/profile/components/RiderPreferences/RiderPreferences";
import { useAuth } from "../auth/hooks/useAuth";
import { useSpots } from "../map/hooks/useSpots";
import { FavoriteSpotCard } from "./components/FavoriteSpotCard/FavoriteSpotCard";
import { Greetings } from "./components/Greetings/Greetings";

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
                    <article className="flex flex-col p-2 lg:px-4 my-auto relative w-full h-fit 2xl:items-center">
                        <Greetings profile={profile} />
                        <RiderPreferences />
                    </article>
                    <article>
                        {profile.favorites &&
                            <div className="flex flex-col p-2 lg:px-4 my-auto relative w-full h-fit 2xl:items-center">
                                {profile.favorites.map(favorite => {
                                    if (!spots) return;
                                    const spot = spots.find(spot => spot.id === favorite)
                                    if (!spot) return;
                                    return (
                                        <FavoriteSpotCard key={favorite} spot={spot} />
                                    )
                                })}
                            </div>
                        }
                    </article>
                </section>
            </main>
        </>
    )
}