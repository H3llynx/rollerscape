import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import { LayersControl, MapContainer, Marker, TileLayer, ZoomControl, useMap } from "react-leaflet";
import Riders from "../../../assets/riders.png";
import { useProfile } from "../../profile/hooks/useProfile";
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
    const { profile } = useProfile();
    const [center, setCenter] = useState<LatLngExpression | null>(null);

    useEffect(() => {
        if (profile.home_lat && profile.home_lon)
            setCenter([profile.home_lat, profile.home_lon])
    }, [profile]);

    const homeIcon = L.icon({
        iconUrl: showAvatar(profile) as string,
        iconSize: [50, 50],
        iconAnchor: [25, 55],
        popupAnchor: [0, -50],
        className: "rounded-full button-shadow border border-dark bg-dark"
    });

    return (
        <div className="map-area">
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
                    <ZoomControl position="bottomright" />
                    <Marker position={center} icon={homeIcon} />
                    {profile.home_lat && profile.home_lon &&
                        <ReCenterMap lat={profile.home_lat} lon={profile.home_lon} />
                    }
                </MapContainer>
            }
            <div className="hidden lg:block absolute z-9991 bottom-0 left-0 w-full pointer-events-none drop-shadow-dark drop-shadow-xs">
                <img src={Riders} alt="" className="w-full" />
            </div>
        </div>
    )
}