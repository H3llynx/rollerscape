import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Header } from "../../components/Header/Header";
import { Loading } from "../../components/Loading/Loading";
import { RiderPreferences } from "../../features/profile/components/RiderPreferences/RiderPreferences";
import { useProfile } from "../../features/profile/hooks/useProfile";
import "./ProfilePage.css";
import { Greetings } from "./components/Greetings/Greetings";
import { ProfileMap } from "./components/ProfileMap/ProfileMap";

export function ProfilePage() {
    const { profile, loading } = useProfile();

    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && profile && !profile.home_location_name) navigate("/onboarding")
    }, [loading, profile, navigate])



    return (
        <>
            <Header />
            <main>
                {(loading || !profile || !profile.home_location_name) &&
                    <div className="w-screen h-dvh flex items-center">
                        <Loading />
                    </div>
                }
                {profile && profile.home_location_name &&
                    <section className="grid w-full md:grid-cols-2">
                        <article className="rider-preferences">
                            <Greetings profile={profile} />
                            <RiderPreferences />
                        </article>
                        <ProfileMap />
                    </section>
                }
            </main>
        </>
    )
}