import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { MapCoordinates } from "../../../../types/geolocation_types";

export function FlyToUser({ center }: { center: MapCoordinates | null }) {
    const map = useMap();
    useEffect(() => {
        if (center) map.flyTo(center, map.getZoom());
    }, [center]);
    return null;
};