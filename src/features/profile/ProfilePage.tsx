import { useEffect } from "react";
import { useNavigate } from "react-router";
import Riders from "../../assets/riders.png";
import { Header } from "../../components/Header/Header";
import { RiderPreferences } from "../../features/profile/components/RiderPreferences/RiderPreferences";
import { useAuth } from "../auth/hooks/useAuth";
import { Greetings } from "./components/Greetings/Greetings";

export function ProfilePage() {
    const { profile, loading } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && profile && !profile.home_location_name) navigate("/onboarding")
    }, [loading, profile, navigate]);

    return (
        <>
            <Header />
            <main className="w-full h-full place-content-center">
                {profile && profile.home_location_name &&
                    <section className="grid w-full md:grid-cols-2 h-full">
                        <article className="flex flex-col p-2 lg:px-4 my-auto relative w-full h-fit 2xl:items-center">
                            <Greetings profile={profile} />
                            <RiderPreferences />
                        </article>
                        <div className="hidden lg:block mt-auto w-full pointer-events-none drop-shadow-dark drop-shadow-xs">
                            <img src={Riders} alt="" className="w-full" />
                        </div>
                    </section>
                }
            </main>
        </>
    )
}