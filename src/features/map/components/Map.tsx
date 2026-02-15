import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, ZoomControl, useMap } from "react-leaflet";
import home from "../../../assets/home.png";
import { useProfile } from "../../profile/hooks/useProfile";
import "./Map.css";

const ReCenterMap = ({ lat, lon }: { lat: number; lon: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lon], map.getZoom());
    }, [lat, lon, map]);

    return null;
}

export function Map() {
    const { profile } = useProfile();
    const [center, setCenter] = useState<LatLngExpression | null>(null);

    useEffect(() => {
        if (profile.home_lat && profile.home_lon)
            setCenter([profile.home_lat, profile.home_lon])
    }, [profile]);

    const homeIcon = L.icon({
        iconUrl: profile.avatar_url || home,
        iconSize: [60, 60],
        iconAnchor: [25, 55],
        popupAnchor: [0, -50],
        className: `${profile.avatar_url ? "rounded-full button-shadow border border-dark" : ""}`
    });

    return (
        <div className="map-area">
            {center &&
                <MapContainer center={center} zoom={16} scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ZoomControl position="bottomright" />
                    <Marker position={center} icon={homeIcon} />
                    {profile.home_lat && profile.home_lon &&
                        <ReCenterMap lat={profile.home_lat} lon={profile.home_lon} />
                    }
                </MapContainer>
            }
        </div>
    )
}