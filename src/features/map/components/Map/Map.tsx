
import { LocateFixed } from "lucide-react";
import type { ReactNode } from "react";
import { LayersControl, MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { useMediaQuery } from "react-responsive";
import { useLocation, useNavigate } from "react-router";
import Add from "../../../../assets/add.png";
import { Button } from "../../../../components/Button/Button";
import { layers } from "../../../../config/leaflet";
import type { MapCoordinates } from "../../../../types/geolocation_types";
import { useAuth } from "../../../auth/hooks/useAuth";
import "./Map.css";

type Map = {
    center: MapCoordinates;
    zoom: number;
    other?: ReactNode;
    children: ReactNode;
    trackUser?: () => void;
}

export function Map({ center, zoom, other, children, trackUser }: Map) {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const { pathname } = useLocation();
    const isDesktop = useMediaQuery({ minWidth: 1024 });

    return (
        <div className="sticky w-full h-full inset-0">
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}>
                <LayersControl position="bottomright" collapsed={isDesktop ? false : true}>
                    {layers.map(layer => {
                        return (
                            <LayersControl.BaseLayer key={layer.name} checked={layer.checked} name={layer.name}>
                                <TileLayer
                                    attribution={layer.attribution}
                                    url={layer.url}
                                    maxZoom={20}
                                />
                            </LayersControl.BaseLayer>
                        )
                    })}
                </LayersControl>
                <ZoomControl position="bottomright" />
                <Control position="bottomleft">
                    <div className="md:flex md:gap-0.5 items-end">
                        {other}
                        <div className="flex gap-0 flex-wrap">
                            {profile && pathname !== "/add-spot" &&
                                <Button
                                    style="tertiary"
                                    className="add-spot-btn"
                                    aria-label="Add new spot"
                                    onClick={() => navigate("/add-spot")}>
                                    <img src={Add} className="w-12 h-auto" />
                                </Button>
                            }
                            {trackUser &&
                                <Button
                                    style="icon"
                                    className="track-me-btn"
                                    aria-label="Track my current location"
                                    onClick={trackUser}>
                                    <LocateFixed
                                        aria-hidden
                                        fill="white"
                                        className="track-icon"
                                    />
                                </Button>
                            }
                        </div>
                    </div>
                </Control>
                {children}
            </MapContainer>
        </div>
    )
}