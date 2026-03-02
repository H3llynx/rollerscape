import L from "leaflet";
import { Marker, Polyline } from 'react-leaflet';
import FlagMarker from "../../../../assets/markers/flag.png";
import FlagMarker2 from "../../../../assets/markers/flag2.png";
import StartMarker from "../../../../assets/markers/spot-marker.png";
import StartMarker2 from "../../../../assets/markers/spot-marker2.png";
import type { Coordinates, MapCoordinates } from "../../../../types/geolocation_types";


type RouteDisplay = {
    data: Coordinates[];
    selected?: boolean;
    custom?: boolean;
    onSelect?: () => void
}

export function RouteDisplay({ data, selected, custom = false, onSelect }: RouteDisplay) {
    if (!data || data.length < 2) return null;

    const startIcon = L.icon({
        iconUrl: custom ? StartMarker : StartMarker2,
        iconSize: [50, 50],
        iconAnchor: [26, 41],
        className: "spot-marker"
    });

    const endIcon = L.icon({
        iconUrl: custom ? FlagMarker : FlagMarker2,
        iconSize: [50, 50],
        iconAnchor: [21, 42],
        className: "spot-marker"
    });

    const getColor = () => {
        if (custom) return "green";
        if (selected) return "var(--color-rgba-turquoise)";
        return "var(--color-grey)";
    };
    const getWeight = () => {
        if (custom) return 8;
        else return selected ? 8 : 6;
    };

    const coords: MapCoordinates[] = data.map(
        coord => [coord.lat, coord.lon] as MapCoordinates
    );

    return (
        <>
            <Polyline
                positions={coords}
                pathOptions={{
                    color: getColor(),
                    weight: getWeight(),
                    opacity: selected ? 1 : 0.5
                }}
                eventHandlers={onSelect ? { click: onSelect } : {}}
            />
            <Marker position={coords[0]} icon={startIcon} />
            <Marker position={coords[coords.length - 1]} icon={endIcon} />
        </>
    )
}