import L from "leaflet";
import { Flag } from "lucide-react";
import { renderToString } from "react-dom/server";
import { Marker, Polyline } from 'react-leaflet';
import type { MapCoordinates } from "../../../../types/geolocation_types";
import type { JsonCoordinates } from "../../../../types/spots_types";

const startEndIcon = L.divIcon({
    html: renderToString(
        <Flag color="var(--color-dark)"
            fill="rgb(21, 177, 162)"
            strokeWidth={3}
            size={24} />),
    iconAnchor: [6, 22]
});

export function RouteDisplay({ data }: { data: JsonCoordinates }) {

    if (!data || data.type === "point") return null;

    const coords: MapCoordinates[] = data.coordinates.map(
        c => [c.lat, c.lon] as MapCoordinates
    );

    return <>
        <Polyline
            positions={coords}
            pathOptions={{
                color: "var(--color-rgba-turquoise)",
                weight: 7
            }}
        />
        <Marker position={coords[0]} icon={startEndIcon} />
        <Marker position={coords[coords.length - 1]} icon={startEndIcon} />
    </>
}