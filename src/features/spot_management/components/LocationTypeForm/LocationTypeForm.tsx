import { File, X } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../../../components/Button/Button";
import { Dropdown } from "../../../../components/Dropdown/Dropdown";
import { addSpotFields } from "../../../../config/spots";
import type { Coordinates } from "../../../../types/geolocation_types";
import type { RouteGenMode, Spot } from "../../../../types/spots_types";
import { capitalize } from "../../../../utils/helpers";
import { parseGpx } from "../../utils";

type LocationTypeForm = {
    locationType: Spot["location_type"];
    routeGenMode: RouteGenMode | null;
    setLocationType: (value: Spot["location_type"]) => void;
    setGpxCoordinates: (value: Coordinates[] | null) => void
    setRouteGenMode: (value: RouteGenMode | null) => void;
    onSubmit: () => void;
}

export function LocationTypeForm({ locationType, routeGenMode, setRouteGenMode, setGpxCoordinates, setLocationType, onSubmit }: LocationTypeForm) {
    const { location_type, route_gen_mode, gpx } = addSpotFields;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [hasGpx, setHasGpx] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleLocationTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLocationType(e.target.value as Spot["location_type"]);
        if (e.target.value === "route") { setRouteGenMode(route_gen_mode.options[0].value) };
        if (e.target.value === "point") { setRouteGenMode(null) };
    };

    const handleGpxUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const gpx = e.target.files?.[0] || null;
        if (!gpx) return;
        setHasGpx(true);
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target && event.target.result) {
                const parsed = parseGpx(event.target.result as string);
                setGpxCoordinates(parsed);
            }
        };
        reader.readAsText(gpx);
    };

    const handleGpxClear = () => {
        if (fileInputRef.current) fileInputRef.current.value = "";
        setGpxCoordinates(null);
        setHasGpx(false);
    };

    return (
        <div className="absolute w-full inset-0 bg-blur flex justify-center items-center">
            <form
                onSubmit={onSubmit}
                className="w-xs md:w-sm rounded-lg border font-main font-medium border-grey text-sm bg-bg-rgba p-2 md:px-3 bg-blur dialog-shadow">
                <h2 className="mb-2">Adding new spot...</h2>
                <div className="flex flex-col gap-1.5">
                    <Dropdown
                        id={location_type.id}
                        label={location_type.label}
                        value={locationType}
                        onChange={handleLocationTypeChange}
                    >
                        {location_type.options.map((option) => {
                            return (
                                <option key={option} value={option}>{capitalize(option)}</option>
                            )
                        })}
                    </Dropdown>
                    {locationType === "route" && routeGenMode &&
                        <Dropdown
                            id={route_gen_mode.id}
                            label={route_gen_mode.label}
                            value={routeGenMode}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                setRouteGenMode(e.target.value as RouteGenMode)}
                        >
                            {route_gen_mode.options.map((rgm) => {
                                return (
                                    <option key={rgm.value} value={rgm.value}>{capitalize(rgm.label)}</option>
                                )
                            })}
                        </Dropdown>
                    }
                    {routeGenMode === "gpx" &&
                        <fieldset className="flex">
                            <label htmlFor={gpx.id} className="file-label">
                                <File />
                                <input
                                    id={gpx.id}
                                    className="text-xs font-medium cursor-pointer"
                                    type={gpx.input_type}
                                    ref={fileInputRef}
                                    onChange={handleGpxUpload}
                                    accept=".gpx"
                                />
                            </label>
                            {hasGpx &&
                                <Button type="button" style="icon" aria-label="Remove file" onClick={handleGpxClear}><X aria-hidden /></Button>
                            }
                        </fieldset>
                    }
                </div>
                <div className="flex mt-1.5 gap-0.5 justify-center">
                    <Button
                        style="primary"
                        className="bg-text text-bg-main"
                    >
                        Confirm
                    </Button>
                    <Button
                        type="button"
                        style="secondary"
                        className=" text-text border-text"
                        onClick={() => navigate("/")}
                    >
                        Cancel
                    </Button>
                </div>
            </form >
        </div >
    )
}