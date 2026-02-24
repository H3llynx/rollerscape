import L from "leaflet";
import { Marker } from 'react-leaflet';
import SpotMarker from "../../../../assets/spot-marker.png";
import type { MapCoordinates } from "../../../../types/geolocation_types";

const spotIcon = L.icon({
    iconUrl: SpotMarker,
    iconSize: [50, 50],
    iconAnchor: [30, 35],
    className: "spot-marker"
});

export function AddMarker({ position }: { position: MapCoordinates }) {
    return (
        <Marker
            position={position}
            icon={spotIcon}
        >
        </Marker >
    )
}