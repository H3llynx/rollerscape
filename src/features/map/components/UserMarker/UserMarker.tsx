import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import { useEffect } from "react";
import { Marker, useMap } from "react-leaflet";
import type { UserProfile } from "../../../../types/user_types";
import { showAvatar } from "../../../profile/utils";

type UserMarker = {
    profile: UserProfile;
    center: LatLngExpression
}

const ReCenterMap = ({ lat, lon }: { lat: number; lon: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lon], map.getZoom());
    }, [lat, lon, map]);

    return null;
}

export function UserMarker({ profile, center }: UserMarker) {
    const homeIcon = L.icon({
        iconUrl: showAvatar(profile) as string,
        iconSize: [50, 50],
        iconAnchor: [25, 55],
        popupAnchor: [0, -50],
        className: "rounded-full button-shadow border border-rgba-yellow bg-dark-2"
    });
    return (
        <>
            <Marker position={center} icon={homeIcon} />
            {profile.home_lat && profile.home_lon &&
                <ReCenterMap lat={profile.home_lat} lon={profile.home_lon} />}
        </>
    )
}