import L from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { MapCoordinates } from "../../../../types/geolocation_types";
import type { JsonCoordinates } from "../../../../types/spots_types";


export function LocationLayer({ data }: { data: JsonCoordinates }) {
    const map = useMap();

    useEffect(() => {
        if (!data) return;

        if (data.type === "point") {
            const layer = L.marker([data.coordinates.lat, data.coordinates.lon]);
            layer.addTo(map);
            return () => { layer.remove(); };

        } else if (data.type === "route") {
            const coords: MapCoordinates[] = data.coordinates.map(
                c => [c.lat, c.lon] as MapCoordinates
            );
            const layer = L.polyline(coords, { color: '#3388ff', weight: 4 });
            layer.addTo(map);
            return () => { layer.remove(); };
        }

    }, [data, map]);

    return null;
}