
import { LocateFixed } from "lucide-react";
import type { ReactNode } from "react";
import { LayersControl, MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { Button } from "../../../../components/Button/Button";
import { layers } from "../../../../config/leaflet";
import type { MapCoordinates } from "../../../../types/geolocation_types";
import "./Map.css";


type BaseMap = {
    center: MapCoordinates;
    zoom: number;
    other?: ReactNode;
    children: ReactNode;
    trackUser: () => void;
}

export function Map({ center, zoom, other, children, trackUser }: BaseMap) {
    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}>
            <LayersControl position="bottomright" collapsed={false}>
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
                <div className="flex gap-0.5 mx-0.5 relative md:items-end">
                    {other}
                    <Button
                        style="icon"
                        className="track-me-btn"
                        aria-label="Track my current location"
                        onClick={trackUser}>
                        <LocateFixed aria-hidden fill="white" className="track-icon" />
                    </Button>
                </div>
            </Control>
            {children}
        </MapContainer>
    )
}