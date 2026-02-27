import { useRef, useState } from "react";
import { Dialog } from "../../../../components/Dialog/Dialog";
import { Dropdown } from "../../../../components/Dropdown/Dropdown";
import { IconInput } from "../../../../components/IconInput/IconInput";
import { Input } from "../../../../components/Input/Input";
import { databases } from "../../../../config/databases";
import { riderPreferencesErrors } from "../../../../config/errors";
import { SPOT_TYPES } from "../../../../config/spots";
import { SKATING_STYLES, SKILLS, type SkatingStyle, type SkillLevel } from "../../../../config/user_info";
import { updateData } from "../../../../services/data";
import type { SpotType } from "../../../../types/spots_types";
import { useAuth } from "../../../auth/hooks/useAuth";
import { SectionTemplate } from "../SectionTemplate/SectionTemplate";
import "./RollerbladerProfileSection.css";

export function RollerbladerProfileSection() {
    const [error, setError] = useState<string | null>(null);
    const { profile, setProfile } = useAuth();
    const dialogRef = useRef<HTMLDialogElement>(null);
    if (!profile) return;

    const handleClose = () => {
        dialogRef.current?.close();
        setError(null);
    };

    const handleSkillChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSkill = e.target.value as SkillLevel;
        const { data, error } = await updateData({ id: profile.id, skill_level: newSkill }, databases.profiles);
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
        const { data, error } = await updateData({ id: profile.id, preferred_spot_types: updated }, databases.profiles);
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
        const { data, error } = await updateData({ id: profile.id, skating_style: updated }, databases.profiles);
        if (error) setError(riderPreferencesErrors.skating_style);
        else {
            setProfile(data);
        }
    };

    return (
        <SectionTemplate title="Rollerblader profile">
            <div className="rider-preferences-inputs">
                <Dropdown
                    label="How do you roll?"
                    defaultValue={profile?.skill_level}
                    onChange={handleSkillChange}
                >
                    {SKILLS.map(skill => {
                        return (
                            <option key={skill.value} value={skill.value}>{skill.label}</option>
                        )
                    })}
                </Dropdown>
                <fieldset>
                    <div className="legend-container">
                        <legend className="font-special">
                            Preferred spot types:
                        </legend>
                        <span className="text-text-secondary">(Select all that apply)</span>
                        <p className="text-grey text-xs">
                            <span>Why are we asking this? </span>
                            So we can pre-filter the map to show only the spots you actually care about — no noise, just your kind of skating.
                        </p>
                    </div>
                    <div className="spot-types-grid">
                        {SPOT_TYPES.map((type) => (
                            <IconInput
                                key={type.value}
                                id={type.value}
                                label={type.label}
                                value={type.value}
                                onChange={() => handleSpotsChange(type.value)}
                                checked={profile.preferred_spot_types?.includes(type.value)}
                            >
                                <img src={type.img} alt={type.label} />
                            </IconInput>
                        ))}
                    </div>
                </fieldset>
                <fieldset>
                    <div className="legend-container">
                        <legend className="font-special">
                            Skating style:
                        </legend>
                        <span className="text-text-secondary">(Select all that apply)</span>
                        <p className="text-grey text-xs">
                            <span>Why are we asking this? </span>
                            So other skaters know where you're coming from. A cruiser and a street skater don't always agree on what makes a great spot — and that's totally fine! Your style gives context to your reviews and recommendations.                            </p>
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
        </SectionTemplate>
    )
}