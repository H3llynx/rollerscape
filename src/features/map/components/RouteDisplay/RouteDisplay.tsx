import L from "leaflet";
import { Flag } from "lucide-react";
import { renderToString } from "react-dom/server";
import { Marker, Polyline } from 'react-leaflet';
import type { Coordinates, MapCoordinates } from "../../../../types/geolocation_types";

const startEndIcon = L.divIcon({
    html: renderToString(
        <Flag color="var(--color-dark)"
            fill="rgb(21, 177, 162)"
            strokeWidth={3}
            size={24} />),
    iconAnchor: [6, 22]
});

type RouteDisplay = {
    data: Coordinates[];
    selected?: boolean;
    onSelect?: () => void
}

export function RouteDisplay({ data, selected = false, onSelect }: RouteDisplay) {

    if (!data || data.length < 2) return null;

    const coords: MapCoordinates[] = data.map(
        coord => [coord.lat, coord.lon] as MapCoordinates
    );

    return <>
        <Polyline
            positions={coords}
            pathOptions={{
                color: selected ? "var(--color-rgba-turquoise)" : "grey",
                weight: selected ? 7 : 4,
                opacity: selected ? 1 : 0.5
            }}
            eventHandlers={onSelect ? { click: onSelect } : {}}
        />
        <Marker position={coords[0]} icon={startEndIcon} />
        <Marker position={coords[coords.length - 1]} icon={startEndIcon} />
    </>
}