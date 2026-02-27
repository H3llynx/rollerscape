import { Edit2, LocationEdit } from "lucide-react";
import { useRef } from "react";
import { Button } from "../../../../components/Button/Button";
import { Dialog } from "../../../../components/Dialog/Dialog";
import type { UserProfile } from "../../../../types/user_types";
import { showFlag } from "../../utils";
import { LocationRequest } from "../LocationRequest/LocationRequest";
import { NameChangeForm } from "../NameChangeForm/NameChangeForm";
import { ProfilePicture } from "../ProfilePicture/ProfilePicture";
import { SectionTemplate } from "../SectionTemplate/SectionTemplate";

export function GreetingsSection({ profile }: { profile: UserProfile }) {
    const locationRef = useRef<HTMLDialogElement>(null);
    const nameRef = useRef<HTMLDialogElement>(null);

    const handleClose = () => {
        locationRef.current?.close();
        nameRef.current?.close();
    };
    const titleAndButton = (
        <div className="flex gap-0.5">
            <h2>Welcome {profile.name}!</h2>
            <Button
                onClick={() => nameRef.current?.showModal()}
                style="icon"
                aria-label="Change your name"
                className="inline p-0 align-middle"
            >
                <Edit2 aria-hidden width={16} className="text-grey hover:text-yellow" />
            </Button>
        </div>
    )

    return (
        <SectionTemplate titleWithButton={titleAndButton}>
            <div className="flex flex-row-reverse gap-1 justify-end md:flex-row md:justify-between items-center">
                <div className="flex items-center px-0.5 mt-1 flex-wrap w-full">
                    <p className="font-special w-full">Home location:</p>
                    <p className="text-sm text-text-secondary w-fit mr-0.5 capitalize">{profile.home_location_name} </p>
                    <div className="flex items-center w-fit">
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
                <ProfilePicture />
            </div>
            <Dialog ref={locationRef} close={handleClose}>
                <LocationRequest onSuccess={() => locationRef.current?.close()} />
            </Dialog>
            <Dialog ref={nameRef} close={handleClose}>
                <NameChangeForm onSuccess={() => nameRef.current?.close()} />
            </Dialog>
        </SectionTemplate >
    )
}