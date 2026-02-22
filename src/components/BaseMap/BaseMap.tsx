import { LayersControl, MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { layers } from "../../config/leaflet";
import type { MapCoordinates } from "../../types/geolocation_types";

type BaseMap = {
    center: MapCoordinates;
    zoom: number;
    children?: React.ReactNode;
}

export function BaseMap({ center, zoom, children }: BaseMap) {
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
        >
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
            {children}
        </MapContainer>
    );
}