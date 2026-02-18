import L from "leaflet";
import { Marker, Popup } from 'react-leaflet';
import Roller from "../../../../assets/marker.png";
import type { Spot } from '../../../../types/spots_types';

const spotIcon = L.icon({
    iconUrl: Roller,
    iconSize: [50, 50],
    iconAnchor: [60, 10],
    popupAnchor: [0, -50],
    className: "drop-shadow-lg drop-shadow-rgba-dark"
});

export function SpotMarker({ spot }: { spot: Spot }) {
    return (
        <Marker position={[spot.display_lat, spot.display_lon]} icon={spotIcon}>
            <Popup>
                <h3>{spot.name}</h3>
            </Popup>
        </Marker>
    )
}