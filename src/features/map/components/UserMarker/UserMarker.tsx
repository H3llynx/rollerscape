import L from "leaflet";
import { Marker } from "react-leaflet";
import LocationMarker from "../../../../assets/markers/location.png";
import { useAuth } from "../../../auth/hooks/useAuth";
import { showAvatar } from "../../../profile/utils";
import { useCenter } from "../../hooks/useCenter";

export function UserMarker() {
    const { center } = useCenter();
    const { profile } = useAuth();
    if (!center) return

    const icon = profile ? showAvatar(profile) : LocationMarker;
    const className = profile ? "rounded-full button-shadow border border-rgba-yellow bg-dark-2" : "drop-shadow-md drop-shadow-white";

    const userIcon = L.icon({
        iconUrl: icon as string,
        iconSize: [50, 50],
        iconAnchor: [25, 55],
        popupAnchor: [0, -50],
        className: className
    });

    return (
        <Marker position={center} icon={userIcon} />
    )
}