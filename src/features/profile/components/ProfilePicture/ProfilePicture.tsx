import { Camera, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../../../components/Button/Button";
import { databases } from "../../../../config/databases";
import { udpdateError } from "../../../../config/errors";
import { updateData } from "../../../../services/data";
import { hostImg } from "../../../../services/image-hosting";
import { useAuth } from "../../../auth/hooks/useAuth";
import { showAvatar } from "../../utils";
import "./ProfilePicture.css";

export function ProfilePicture() {
    const [preview, setPreview] = useState<string | null>(null);
    const { profile, setProfile } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<boolean>(false);

    if (!profile) return;

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handlePhotoClear = () => {
        if (fileInputRef.current) fileInputRef.current.value = "";
        setPreview(null);
    };

    const changePicture = async () => {
        const file = fileInputRef.current?.files?.[0];
        if (file) {
            const url = await hostImg(file);
            if (!url) {
                setError(true);
                setPreview(null);
                return;
            };
            const { error } = await updateData({ id: profile.id, avatar_url: url }, databases.profiles);
            if (error) setError(true);
            else {
                setPreview(null);
                setProfile({ ...profile, avatar_url: url });
            }
        };
    };

    return (
        <div className="relative">
            <div className="image-container avatar-button-container">
                {preview
                    ? <img src={preview} alt="Preview" />
                    : <img src={showAvatar(profile)} alt="profile picture" />
                }
                <label
                    htmlFor="profile-picture"
                    aria-label="Update profile picture"
                    className="bg-blur">
                    <span aria-hidden>
                        <Camera aria-hidden />Update
                    </span>
                    <input
                        id="profile-picture"
                        type="file"
                        onChange={handlePictureChange}
                        ref={fileInputRef}
                        accept="image/*"
                    />
                </label>
            </div>
            {preview &&
                <div className="flex items-center gap-0.5 justify-center">
                    <Button style="tertiary" className="text-sm p-0" onClick={changePicture}>Confirm</Button>
                    <Button type="button" style="icon" className="p-0" aria-label="Remove images" onClick={handlePhotoClear}><X width={16} aria-hidden /></Button>
                </div>
            }
            {error && <p className="error absolute text-xs text-center -mx-1">{udpdateError}
                <Button
                    style="icon"
                    aria-label="Close error message"
                    className="inline p-0 align-middle text-red"
                    onClick={() => setError(false)}
                >
                    <X aria-hidden width={12} />
                </Button>
            </p>
            }
        </div>
    )
}