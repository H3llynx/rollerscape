import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { MapCoordinates } from "../../../../types/geolocation_types";
import type { SpotFullInfo } from "../../../../types/spots_types";
import { useSpots } from "../../hooks/useSpots";

export function FlyToSpot({ spot }: { spot: SpotFullInfo | null }) {
    const map = useMap();
    const { selectedSpot } = useSpots();

    useEffect(() => {
        setTimeout(() => map.invalidateSize(), 400);
    }, [selectedSpot]);

    useEffect(() => {
        if (!spot) return;

        if (spot.location_type === "point") {
            map.flyTo([spot.coordinates[0].lat, spot.coordinates[0].lon], 15);
        } else {
            const bounds = spot.coordinates.map(coords => [coords.lat, coords.lon] as MapCoordinates);
            map.fitBounds(bounds, { padding: [10, 10] });
        }
    }, [spot]);

    return null;
}