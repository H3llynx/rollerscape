import L from "leaflet";
import { Marker } from 'react-leaflet';
import Roller from "../../../../assets/marker.png";
import type { MapCoordinates } from "../../../../types/geolocation_types";
import type { SpotWithTypes } from "../../../../types/spots_types";

type SpotMarker = {
    spot: SpotWithTypes;
    position: MapCoordinates;
    onMarkerClick?: () => void;
    dimmed?: boolean;
    reduced?: boolean;
}

const spotIcon = L.icon({
    iconUrl: Roller,
    iconSize: [50, 50],
    iconAnchor: [0, 30],
    popupAnchor: [15, -30],
    className: "drop-shadow-lg drop-shadow-rgba-grey"
});

export function SpotMarker({ spot, position, dimmed, onMarkerClick }: SpotMarker) {
    return (
        <Marker
            position={position}
            icon={spotIcon}
            opacity={dimmed ? 0.3 : 1}
            eventHandlers={{
                ...(onMarkerClick && { click: onMarkerClick })
            }}
            aria-label={`Show ${spot.name} information`}
        >
        </Marker >
    )
}