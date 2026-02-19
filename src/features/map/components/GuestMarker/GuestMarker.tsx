import L from "leaflet";
import { Marker } from "react-leaflet";
import Skater from "../../../../assets/skater.png";
import type { MapCoordinates } from "../../../../types/geolocation_types";

export function GuestMarker({ center }: { center: MapCoordinates }) {
    const homeIcon = L.icon({
        iconUrl: Skater,
        iconSize: [50, 50],
        iconAnchor: [25, 55],
        popupAnchor: [0, -50],
        className: "rounded-full button-shadow border border-rgba-yellow bg-dark-2"
    });
    return (
        <Marker position={center} icon={homeIcon} />
    )
}