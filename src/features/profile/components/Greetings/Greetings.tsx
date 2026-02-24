import { Edit2, LocationEdit } from "lucide-react";
import { useRef } from "react";
import { Button } from "../../../../components/Button/Button";
import { Dialog } from "../../../../components/Dialog/Dialog";
import type { UserProfile } from "../../../../types/user_types";
import { showFlag } from "../../utils";
import { LocationRequest } from "../LocationRequest/LocationRequest";
import { NameChangeForm } from "../NameChangeForm/NameChangeForm";
import { ProfilePicture } from "../ProfilePicture/ProfilePicture";

export function Greetings({ profile }: { profile: UserProfile }) {
    const locationRef = useRef<HTMLDialogElement>(null);
    const nameRef = useRef<HTMLDialogElement>(null);

    const handleClose = () => {
        locationRef.current?.close();
        nameRef.current?.close();
    };

    return (
        <>
            <div className="flex flex-row-reverse gap-1 justify-end md:flex-row md:justify-between items-center">
                <div>
                    <h2 className="px-0.5 inline">Welcome {profile.name}!</h2>
                    <Button
                        onClick={() => nameRef.current?.showModal()}
                        style="icon"
                        aria-label="Change your name"
                        className="inline p-0 align-middle"
                    >
                        <Edit2 aria-hidden width={16} className=" text-grey hover:text-yellow" />
                    </Button>
                    <div className="flex items-center gap-[5px] px-0.5 mt-1 flex-wrap">
                        <span className="font-special">Home location: </span>
                        <span className="text-sm text-text-secondary">{profile.home_location_name} </span>
                        <div className="flex items-center">
                            <span>{showFlag(profile.home_country_code)}</span>
                            <Button
                                onClick={() => locationRef.current?.showModal()}
                                style="icon"
                                aria-label="Update your home location"
                            >
                                <LocationEdit aria-hidden width={20} className="text-grey hover:text-yellow pb-[5px]" />
                            </Button>
                        </div>
                    </div>
                </div>
                <ProfilePicture />
            </div>
            <Dialog ref={locationRef} close={handleClose}>
                <LocationRequest onSuccess={() => locationRef.current?.close()} />
            </Dialog>
            <Dialog ref={nameRef} close={handleClose}>
                <NameChangeForm onSuccess={() => nameRef.current?.close()} />
            </Dialog>
        </>
    )
}