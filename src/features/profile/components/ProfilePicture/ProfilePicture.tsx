import { Camera, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../../../components/Button/Button";
import { useAuth } from "../../../auth/hooks/useAuth";
import { showAvatar } from "../../utils";
import "./ProfilePicture.css";

export function ProfilePicture() {
    const [preview, setPreview] = useState<string | null>(null);
    const { profile, setProfile } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                    />
                </label>
            </div>
            {preview &&
                <div className="flex items-center gap-0.5 justify-center">
                    <Button style="tertiary" className="text-sm p-0">Confirm</Button>
                    <Button type="button" style="icon" className="p-0" aria-label="Remove images" onClick={handlePhotoClear}><X width={16} aria-hidden /></Button>
                </div>
            }
        </div>
    )
}