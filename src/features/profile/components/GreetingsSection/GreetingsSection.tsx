import { Edit2, LocationEdit, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../../../components/Button/Button";
import { Dialog } from "../../../../components/Dialog/Dialog";
import { deleteUserError } from "../../../../config/errors";
import { deleteUser } from "../../../../services/auth";
import type { UserProfile } from "../../../../types/user_types";
import { useAuth } from "../../../auth/hooks/useAuth";
import { showFlag } from "../../utils";
import { LocationRequest } from "../LocationRequest/LocationRequest";
import { NameChangeForm } from "../NameChangeForm/NameChangeForm";
import { ProfilePicture } from "../ProfilePicture/ProfilePicture";
import { SectionTemplate } from "../SectionTemplate/SectionTemplate";

export function GreetingsSection({ profile }: { profile: UserProfile }) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [action, setAction] = useState<"name" | "location" | "delete" | null>(null);
    const [error, setError] = useState<boolean>(false);
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleClose = () => {
        setAction(null);
        setError(false);
        dialogRef.current?.close();
    };

    useEffect(() => {
        if (!action) return;
        dialogRef.current?.showModal();
    }, [action])

    const deleteProfile = async () => {
        await deleteUser();
        if (error) {
            setError(true);
            return;
        };
        setUser(null);
        navigate("/auth");
    };

    const titleAndButton = (
        <div className="flex gap-0.5">
            <h2 className="truncate">Welcome {profile.name}!</h2>
            <Button
                onClick={() => setAction("name")}
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
                            onClick={() => setAction("location")}
                            style="icon"
                            aria-label="Update your home location"
                        >
                            <LocationEdit aria-hidden width={20} className="text-grey hover:text-yellow pb-[5px]" />
                        </Button>
                    </div>
                </div>
                <ProfilePicture />
            </div>
            <Button style="collapsed" onClick={() => setAction("delete")}>
                <Trash2 aria-hidden width={18} />
                <span>Delete my profile</span>
            </Button>

            <Dialog ref={dialogRef} close={handleClose}>
                {action === "name" &&
                    <NameChangeForm onSuccess={() => dialogRef.current?.close()} />
                }
                {action === "location" &&
                    <LocationRequest onSuccess={() => dialogRef.current?.close()} />
                }
                {action === "delete" &&
                    <>
                        <p>Your profile will be deleted, but your spots will remain for the community.
                            This move can’t be undone. Continue?</p>
                        <div className="flex gap-0.5 justify-center">
                            <Button onClick={deleteProfile}>Confirm</Button>
                            <Button style="secondary" onClick={handleClose}>Cancel</Button>
                        </div>
                    </>
                }
                {error && deleteUserError}
            </Dialog>
        </SectionTemplate >
    )
}