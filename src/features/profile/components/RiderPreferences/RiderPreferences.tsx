import { useRef, useState } from "react";
import { Dialog } from "../../../../components/Dialog/Dialog";
import { Dropdown } from "../../../../components/Dropdown/Dropdown";
import { Input } from "../../../../components/Input/Input";
import { databases } from "../../../../config/databases";
import { riderPreferencesErrors } from "../../../../config/errors";
import { SPOT_TYPES } from "../../../../config/spots";
import { SKATING_STYLES, SKILLS, type SkatingStyle } from "../../../../config/user_info";
import { updateData } from "../../../../services/data";
import type { SpotType } from "../../../../types/spots_types";
import type { UserProfile } from "../../../../types/user_types";
import { useAuth } from "../../../auth/hooks/useAuth";
import "./RiderPreferences.css";

export function RiderPreferences() {
    const [error, setError] = useState<string | null>(null);
    const { profile, setProfile } = useAuth();
    const dialogRef = useRef<HTMLDialogElement>(null);
    if (!profile) return;

    const handleClose = () => {
        dialogRef.current?.close();
        setError(null);
    };

    const handleSkillChange = async (column: keyof UserProfile, e: React.ChangeEvent<HTMLSelectElement>) => {
        const updatedProfile = { ...profile, [column]: e.target.value } as UserProfile;
        const { data, error } = await updateData(updatedProfile, databases.profiles);
        if (error) setError(riderPreferencesErrors.skill);
        else {
            setProfile(data);
        }
    };

    const handleSpotsChange = async (value: SpotType) => {
        const current = profile.preferred_spot_types || [];
        const updated = current.includes(value)
            ? current.filter(type => type !== value)
            : [...current, value];
        const updatedProfile = {
            ...profile,
            preferred_spot_types: updated
        };
        const { data, error } = await updateData(updatedProfile, databases.profiles);
        if (error) setError(riderPreferencesErrors.spot_types);
        else {
            setProfile(data);
        }
    };

    const handleStyleChange = async (value: SkatingStyle) => {
        const current = profile.skating_style || [];
        const updated = current.includes(value)
            ? current.filter(style => style !== value)
            : [...current, value];
        const updatedProfile = {
            ...profile,
            skating_style: updated
        };
        const { data, error } = await updateData(updatedProfile, databases.profiles);
        if (error) setError(riderPreferencesErrors.skating_style);
        else {
            setProfile(data);
        }
    };

    return (
        <div className="rider-preferences-inputs">
            <Dropdown
                label="How do you roll?"
                defaultValue={profile?.skill_level}
                onChange={(e) => handleSkillChange("skill_level", e)}
            >
                {SKILLS.map(skill => {
                    return (
                        <option key={skill.value} value={skill.value}>{skill.label}</option>
                    )
                })}
            </Dropdown>
            <fieldset>
                <div className="fieldset">
                    <legend className="font-special">
                        Preferred spot types:
                    </legend>
                    <span>(Select all that apply)</span>
                </div>
                {SPOT_TYPES.map((spot) => (
                    <Input key={spot.value}
                        variant="checkbox"
                        type="checkbox"
                        value={spot.value}
                        icons={false}
                        label={spot.label}
                        onChange={() => handleSpotsChange(spot.value)}
                        checked={profile.preferred_spot_types?.includes(spot.value)}
                    />
                ))}
            </fieldset>
            <fieldset>
                <div className="fieldset">
                    <legend className="font-special">
                        Skating style:
                    </legend>
                    <span>(Select all that apply)</span>
                </div>
                {SKATING_STYLES.map((style) => (
                    <Input key={style.value}
                        variant="checkbox"
                        type="checkbox"
                        value={style.value}
                        icons={false}
                        label={style.label}
                        onChange={() => handleStyleChange(style.value)}
                        checked={profile.skating_style?.includes(style.value)}
                    />
                ))}
            </fieldset>
            <Dialog ref={dialogRef} style="error" close={handleClose}>
                <p>{error}</p>
            </Dialog>
        </div >
    )
}