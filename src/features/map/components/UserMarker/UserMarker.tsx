import L from "leaflet";
import { Marker } from "react-leaflet";
import Skater from "../../../../assets/skater.png";
import { useAuth } from "../../../auth/hooks/useAuth";
import { showAvatar } from "../../../profile/utils";
import { useCenter } from "../../hooks/useCenter";

export function UserMarker() {
    const { center } = useCenter();
    const { profile } = useAuth();
    if (!center) return

    const icon = profile ? showAvatar(profile) : Skater;

    const userIcon = L.icon({
        iconUrl: icon as string,
        iconSize: [50, 50],
        iconAnchor: [25, 55],
        popupAnchor: [0, -50],
        className: "rounded-full button-shadow border border-rgba-yellow bg-dark-2"
    });

    return (
        <Marker position={center} icon={userIcon} />
    )
}