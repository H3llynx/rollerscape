import L from "leaflet";
import { Marker } from 'react-leaflet';
import Flag from "../../../../assets/markers/flag.png";
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

export function SpotMarker({ spot, position, dimmed, onMarkerClick }: SpotMarker) {

    const spotIcon = L.icon({
        iconUrl: spot.location_type === "point" ? Wheel : Flag,
        iconSize: [35, 35],
        iconAnchor: [21, 18],
        className: `spot-marker ${spot.spot_types[0].name === "greenway" && "hue-rotate-20"}`
    });

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