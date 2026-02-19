import L from "leaflet";
import { Marker, Popup } from 'react-leaflet';
import Roller from "../../../../assets/marker.png";
import type { Spot } from "../../../../types/spots_types";

type SpotMarker = {
    spot: Spot;
    onMarkerClick: () => void;
    onButtonClick: (spot: Spot) => void;
}

const spotIcon = L.icon({
    iconUrl: Roller,
    iconSize: [50, 50],
    iconAnchor: [60, 10],
    popupAnchor: [0, -50],
    className: "drop-shadow-lg drop-shadow-rgba-dark"
});

export function SpotMarker({ spot, onMarkerClick, onButtonClick }: SpotMarker) {
    return (
        <>
            <Marker
                position={[spot.display_lat, spot.display_lon]}
                icon={spotIcon}
                eventHandlers={{ click: onMarkerClick }}>
                <Popup>
                    <h3>{spot.name}</h3>
                    <button onClick={() => onButtonClick(spot)}>Check me out</button>
                </Popup>
            </Marker>
        </>
    )
}