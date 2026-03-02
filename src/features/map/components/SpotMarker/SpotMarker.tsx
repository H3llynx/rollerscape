import L from "leaflet";
import { Marker } from 'react-leaflet';
import Wheel from "../../../../assets/wheel.png";
import type { MapCoordinates } from "../../../../types/geolocation_types";
import type { SpotFullInfo } from "../../../../types/spots_types";

type SpotMarker = {
    spot: SpotFullInfo;
    position: MapCoordinates;
    onMarkerClick?: () => void;
    dimmed?: boolean;
    reduced?: boolean;
}

const spotIcon = L.icon({
    iconUrl: Wheel,
    iconSize: [35, 35],
    iconAnchor: [21, 18],
    className: "spot-marker"
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