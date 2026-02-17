import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import { LocateFixed } from "lucide-react";
import { useEffect, useState } from "react";
import { LayersControl, MapContainer, Marker, TileLayer, ZoomControl, useMap } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import Skater from "../../../assets/skater.png";
import { Button } from "../../../components/Button/Button";
import { getBrowserPosition } from "../../../services/geolocation";
import { useAuth } from "../../auth/hooks/useAuth";
import { showAvatar } from "../../profile/utils";
import "./Map.css";

const ReCenterMap = ({ lat, lon }: { lat: number; lon: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lon], map.getZoom());
    }, [lat, lon, map]);

    return null;
}

export function Map() {
    const { profile } = useAuth();
    const [center, setCenter] = useState<LatLngExpression | null>(null);

    useEffect(() => {
        const loadCenter = async () => {
            if (profile && (profile.home_lat && profile.home_lon))
                setCenter([profile.home_lat, profile.home_lon])
            else {
                const { data } = await getBrowserPosition();
                if (data) {
                    setCenter([data.lat, data.lon]);
                }
            }
        }
        loadCenter();
    }, [profile]);

    const homeIcon = L.icon({
        iconUrl: profile ? showAvatar(profile) as string : Skater,
        iconSize: [50, 50],
        iconAnchor: [25, 55],
        popupAnchor: [0, -50],
        className: "rounded-full button-shadow border border-rgba-yellow bg-dark-2"
    });

    return (
        <div className="w-full h-full">
            {center &&
                <MapContainer center={center} zoom={16} scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}>
                    <LayersControl position="bottomright" collapsed={false}>
                        <LayersControl.BaseLayer checked name="Voyager">
                            <TileLayer
                                attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                maxZoom={20}
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="Dark">
                            <TileLayer
                                attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                maxZoom={20}
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="Satellite">
                            <TileLayer
                                attribution='Tiles © Esri'
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                maxZoom={20}
                            />
                        </LayersControl.BaseLayer>
                    </LayersControl>
                    <Control position="bottomleft">
                        <Button style="icon" className="track-me-btn" aria-label="Track my current location">
                            <LocateFixed aria-hidden fill="white" className="track-me-icon" />
                        </Button>
                    </Control>
                    <ZoomControl position="bottomright" />
                    {profile && <>
                        <Marker position={center} icon={homeIcon} />
                        {profile.home_lat && profile.home_lon &&
                            <ReCenterMap lat={profile.home_lat} lon={profile.home_lon} />
                        }</>}
                </MapContainer>
            }
        </div>
    )
}