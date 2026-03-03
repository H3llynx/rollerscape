import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { Coordinates } from "../../../../types/geolocation_types";

export function FlyToCoords({ coords }: { coords: Coordinates[] }) {
    const map = useMap();

    useEffect(() => {
        setTimeout(() => map.invalidateSize(), 400);
    }, [coords]);

    useEffect(() => {
        if (!coords || !coords.length) return;
        map.flyTo([coords[0].lat, coords[0].lon], map.getZoom());
    }, [coords]);

    return null;
}