import { LocationEdit } from "lucide-react";
import { useRef } from "react";
import { Button } from "../../../../components/Button/Button";
import { Dialog } from "../../../../components/Dialog/Dialog";
import type { UserProfile } from "../../../../types/user_types";
import { showFlag } from "../../utils";
import { LocationRequest } from "../LocationRequest/LocationRequest";

export function Greetings({ profile }: { profile: UserProfile }) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const handleClose = () => {
        dialogRef.current?.close();
    };
    return (
        <>
            <h2 className="px-0.5">Welcome {profile.name}!</h2>
            <div className="flex items-center gap-[5px] px-0.5 flex-wrap">
                <span className="font-special">Home location: </span>
                <span className="text-sm text-text-secondary">{profile.home_location_name} </span>
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
            <Dialog ref={dialogRef} close={handleClose}>
                <LocationRequest onSuccess={() => dialogRef.current?.close()} />
            </Dialog>
        </>
    )
}