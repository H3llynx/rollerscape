import L from "leaflet";
import { Marker } from 'react-leaflet';
import Star from "../../../../assets/svg/star.svg";
import type { MapCoordinates } from "../../../../types/geolocation_types";


const spotIcon = L.icon({
    iconUrl: Star,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
});

export function FavoriteMarker({ position }: { position: MapCoordinates }) {
    return (
        <Marker
            position={position}
            icon={spotIcon}
        >
        </Marker >
    )
}