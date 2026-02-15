import { LocationEdit } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/Button/Button";
import { useAuth } from "../features/auth/hooks/useAuth";
import { LocationRequest } from "../features/profile/components/LocationRequest/LocationRequest";
import { RiderPreferences } from "../features/profile/components/RiderPreferences/RiderPreferences";
import { showFlag } from "../features/profile/utils";

export function ProfilePage() {
    const navigate = useNavigate()
    const { profile } = useAuth();
    if (!profile) {
        navigate("/auth");
        return
    }

    return (
        <main className="w-full">
            {profile && !profile.home_location_name &&
                <LocationRequest />
            }
            <section className="md:grid md:grid-cols-2">
                <article className="flex flex-col gap-1 p-2">
                    <h2>Welcome {profile.name}!</h2>
                    <div className="flex items-center gap-[5px] flex-wrap">
                        <span className="font-special">Home location: </span>
                        <span className="text-sm text-yellow-2">{profile.home_location_name} </span>
                        <div className="flex items-center">
                            <span>{showFlag(profile.home_country_code)}</span>
                            <Button style="icon"><LocationEdit width={20} className="text-grey hover:text-yellow pb-[5px]" /></Button>
                        </div>
                    </div>
                    <RiderPreferences />
                </article>
                <article className="border">

                </article>
            </section>
        </main>
    )
}