
import { LocateFixed, MapPinPlus } from "lucide-react";
import { type ReactNode } from "react";
import { LayersControl, MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { useMediaQuery } from "react-responsive";
import { useLocation, useNavigate } from "react-router";
import AddButton from "../../../../assets/add.png";
import { Button } from "../../../../components/Button/Button";
import { layers } from "../../../../config/leaflet";
import type { MapCoordinates } from "../../../../types/geolocation_types";
import { useAuth } from "../../../auth/hooks/useAuth";
import { LocationSearch } from "../LocationSearch/LocationSearch";
import "./MapBase.css";

type MapBase = {
    center: MapCoordinates;
    zoom: number;
    other?: ReactNode;
    children: ReactNode;
    trackUser?: () => void;
    controls?: boolean;
}

export function MapBase({ center, zoom, other, children, trackUser, controls = true }: MapBase) {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const { pathname } = useLocation();
    const isDesktop = useMediaQuery({ minWidth: 1024 });
    const isTabletorDesktop = useMediaQuery({ minWidth: 768 });

    return (
        <div className="sticky w-full h-full inset-0">
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}>
                {controls ?
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
                    : <TileLayer
                        url={layers[0].url}
                    />
                }
                {controls &&
                    <>
                        <ZoomControl position="bottomright" />
                        <Control position="bottomleft">
                            <div className="controls">
                                {other}
                                <div className="flex max-w-[80vw] flex-wrap md:gap-1 items-center pointer-events-auto">
                                    {profile && pathname !== "/add-spot" &&
                                        <Button
                                            style="tertiary"
                                            className="add-spot-btn slight-shadow md:shadow-none"
                                            aria-label="Add new spot"
                                            onClick={() => navigate("/add-spot")}>
                                            {isTabletorDesktop && <img src={AddButton} className="w-12 pointer-events-none" />}
                                            {!isTabletorDesktop && <MapPinPlus aria-hidden color="var(--color-text-cta)" className="bg-bg-cta rounded-full w-3 h-3 p-0.5" />}
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
                                    <LocationSearch />
                                </div>
                            </div>
                        </Control>
                    </>
                }
                {children}
            </MapContainer>
        </div>
    )
}