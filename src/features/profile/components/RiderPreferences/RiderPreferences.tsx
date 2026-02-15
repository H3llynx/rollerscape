import { Dropdown } from "../../../../components/Dropdown/Dropdown";
import { Input } from "../../../../components/Input/Input";
import { riderProfile } from "../../config/user_info";

export function RiderPreferences() {
    return (
        <div className="max-w-sm flex flex-col gap-2">
            <Dropdown
                label="How do you roll?"
            >
                {riderProfile.skills.map(skill => {
                    return (
                        <option key={skill.value} value={skill.value}>{skill.label}</option>
                    )
                })}
            </Dropdown>
            <fieldset>
                <div className="flex mb-0.5 gap-[5px] items-center">
                    <legend className="font-special">
                        Preferred spot types:
                    </legend>
                    <span className="text-xs font-medium text-yellow-2">(Select all that apply)</span>
                </div>
                {riderProfile.spot_types.map((spot) => (
                    <Input key={spot.value}
                        variant="checkbox"
                        type="checkbox"
                        icons={false}
                        label={spot.label}
                        value={spot.value}
                        className="flex-row"
                    />
                ))}
            </fieldset>
        </div >
    )
}