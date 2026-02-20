import { LayersControl, MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import Riders from "../../../../assets/riders.png";
import type { SpotWithTypes } from "../../../../types/spots_types";
import { SpotMarker } from "../../../map/components/SpotMarker/SpotMarker";
import { layers } from "../../../map/config/leaflet";


export function SingleSpotMap({ spot }: { spot: SpotWithTypes }) {
    return (
        <article className="w-full h-[60dvh] relative z-0 md:absolute md:w-1/2 md:h-full md:top-0 md:right-0">
            <MapContainer center={[spot.display_lat, spot.display_lon]} zoom={16} scrollWheelZoom={false}
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
                <SpotMarker
                    key={spot.id}
                    spot={spot}
                />
            </MapContainer>
            <div className="hidden lg:block lg:absolute bottom-0 w-full pointer-events-none drop-shadow-dark drop-shadow-xs relative z-400">
                <img src={Riders} alt="" className="w-full" />
            </div>
        </article>
    )
}