import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { MapCoordinates } from "../../../../types/geolocation_types";
import type { SpotFullInfo } from "../../../../types/spots_types";

export function FlyToSpot({ spot }: { spot: SpotFullInfo | null }) {
    const map = useMap();

    useEffect(() => {
        if (!spot) return;

        if (spot.location_type === "point") {
            map.flyTo([spot.coordinates[0].lat, spot.coordinates[0].lon], map.getZoom());
        } else {
            const bounds = spot.coordinates.map(coords => [coords.lat, coords.lon] as MapCoordinates);
            map.fitBounds(bounds, { padding: [20, 20] });
        }
    }, [spot]);

    return null;
}