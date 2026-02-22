import { Button } from "../../../../components/Button/Button";
import { Dropdown } from "../../../../components/Dropdown/Dropdown";
import { addSpotFields } from "../../../../config/spots";
import type { Spot } from "../../../../types/spots_types";
import { capitalize } from "../../../../utils/helpers";

type LocationTypeForm = {
    locationType: Spot["location_type"];
    setLocationType: (value: Spot["location_type"]) => void;
    onSubmit: () => void;
}

export function LocationTypeForm({ locationType, setLocationType, onSubmit }: LocationTypeForm) {
    const { location_type } = addSpotFields;

    return (
        <div className="absolute w-full inset-0 bg-blur z-1 flex justify-center items-center">
            <form
                onSubmit={onSubmit}
                className="rounded-lg border font-main font-medium border-grey text-sm bg-bg-rgba py-2 px-3 bg-blur dialog-shadow overflow-hidden">
                <h2 className="mb-2">Adding new spot...</h2>
                <Dropdown
                    id={location_type.id}
                    label={location_type.label}
                    value={locationType}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setLocationType(e.target.value as Spot["location_type"])}
                >
                    {location_type.options.map((option) => {
                        return (
                            <option key={option} value={option}>{capitalize(option)}</option>
                        )
                    })}
                </Dropdown>
                <Button
                    style="secondary"
                    className="border-text text-text mx-auto mt-1"
                >
                    Confirm
                </Button>
            </form>
        </div>
    )
}