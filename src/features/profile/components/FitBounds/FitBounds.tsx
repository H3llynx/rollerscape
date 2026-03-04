import { latLngBounds } from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function FitBounds({ coordinates }: { coordinates: { lat: number, lon: number }[] }) {
    const map = useMap();

    useEffect(() => {
        if (coordinates.length > 1) {
            const bounds = latLngBounds(coordinates.map(c => [c.lat, c.lon]));
            map.fitBounds(bounds, { padding: [20, 20] });
        }
    }, [coordinates]);

    return null;
}