import { useState, type Dispatch, type SetStateAction } from "react";
import { Button } from "../../../../components/Button/Button";
import { getCoordsFromMaps } from "../../../../services/geolocation";
import type { Coordinates } from "../../../../types/geolocation_types";

export function MapsToCoordsForm({ setSpotCoordinates }: { setSpotCoordinates: Dispatch<SetStateAction<Coordinates[]>> }) {
    const [url, setUrl] = useState<string>("")

    const getCoords = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!url) return;
        const { data } = await getCoordsFromMaps(url);
        if (data) {
            setSpotCoordinates([{ lat: data.lat, lon: data.lon }]);
            e.target.value = "";
            setUrl("");
        }
    }

    return (
        <form onSubmit={getCoords} className="flex-row gap-0.5">
            <label htmlFor="maps-url" className="sr-only">Paste a google maps link below</label>
            <input
                placeholder="Google Maps link here..."
                id="maps-url"
                type="url"
                className="slight-shadow"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
            />
            <Button className="px-1 text-nowrap">Pin it</Button>
        </form>
    )
}