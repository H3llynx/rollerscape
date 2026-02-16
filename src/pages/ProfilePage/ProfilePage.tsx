import { LocationEdit } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/Button/Button";
import { Dialog } from "../../components/Dialog/Dialog";
import { Loading } from "../../components/Loading/Loading";
import { Map } from "../../features/map/components/Map";
import { LocationRequest } from "../../features/profile/components/LocationRequest/LocationRequest";
import { RiderPreferences } from "../../features/profile/components/RiderPreferences/RiderPreferences";
import { useProfile } from "../../features/profile/hooks/useProfile";
import { showFlag } from "../../features/profile/utils";
import "./ProfilePage.css";

export function ProfilePage() {
    const { profile, loading } = useProfile();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && profile && !profile.home_location_name) navigate("/onboarding")
    }, [loading, profile, navigate])

    const handleClose = () => {
        dialogRef.current?.close();
    };

    return (
        <main className="profile-page-main">
            {(loading || !profile || !profile.home_location_name) && <Loading />}
            {profile && profile.home_location_name &&
                <section className="grid w-full md:grid-cols-2 place-items-center">
                    <article className="rider-preferences">
                        <h2 className="px-0.5">Welcome {profile.name}!</h2>
                        <div className="flex items-center gap-[5px] px-0.5 flex-wrap">
                            <span className="font-special">Home location: </span>
                            <span className="text-sm text-txt-secondary">{profile.home_location_name} </span>
                            <div className="flex items-center">
                                <span>{showFlag(profile.home_country_code)}</span>
                                <Button
                                    onClick={() => dialogRef.current?.showModal()}
                                    style="icon"
                                    aria-label="Update your home location"
                                >
                                    <LocationEdit aria-hidden width={20} className="text-grey hover:text-yellow pb-[5px]" />
                                </Button>
                            </div>
                        </div>
                        <RiderPreferences />
                        <Dialog ref={dialogRef} close={handleClose}>
                            <LocationRequest onSuccess={() => dialogRef.current?.close()} />
                        </Dialog>
                    </article>
                    <Map />
                </section>
            }
        </main>
    )
}