import L from "leaflet";
import { Flag, MapPin } from "lucide-react";
import { renderToString } from "react-dom/server";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import { useNavigate } from "react-router";
import { layers } from "../../../../config/leaflet";
import { redirecttoSpotUrl } from "../../../../config/urls";
import type { MapCoordinates } from "../../../../types/geolocation_types";
import type { SpotFullInfo } from "../../../../types/spots_types";
import { getSpotType } from "../../../../utils/helpers";
import { MapBase } from "../../../map/components/MapBase/MapBase";
import { ButtonContainer } from "../../../spot_management/components/ButtonContainer/ButtonContainer";
import { FitBounds } from "../FitBounds/FitBounds";
import "./SpotCard.css";

export function SpotCard({ spot, type }: { spot: SpotFullInfo, type: "favorite" | "submitted" }) {
    const navigate = useNavigate();
    if (!spot) return;
    const coords: MapCoordinates[] = spot.coordinates.map(
        coord => [coord.lat, coord.lon] as MapCoordinates
    );
    const startIcon = L.divIcon({
        html: renderToString(
            <MapPin color="var(--color-dark)"
                fill="var(--color-yellow-2)"
                strokeWidth={2}
                size={29} />),
        iconAnchor: [18, 26],
        className: "",
    });

    const endIcon = L.divIcon({
        html: renderToString(
            <Flag color="var(--color-dark-3)"
                fill="var(--color-yellow-2)"
                strokeWidth={2}
                size={30} />),
        iconAnchor: [5, 28],
        className: "",
    });

    if (type === "favorite")
        return (
            <div className="card favorite-map-container -">
                <MapBase
                    center={[spot.coordinates[0].lat, spot.coordinates[0].lon]}
                    zoom={12}
                    controls={false}
                >
                    <Polyline
                        positions={coords}
                        pathOptions={{
                            color: "var(--color-yellow-2)",
                            weight: 5,
                        }}
                    />
                    <Marker position={coords[0]} icon={startIcon} />
                    {coords.length > 1 && <Marker position={coords[coords.length - 1]} icon={endIcon} />}
                </MapBase>
                <div className="favorite-text-overlay overlay">
                    <button aria-label="See that spot on the map" onClick={() => navigate(redirecttoSpotUrl(spot.slug))} className="overlay">
                        <div className="px-1 text-left absolute top-0.5 w-full h-full">
                            <h2 className="text-xl text-dark-3 line-clamp-2 text-shadow-md text-shadow-white bg-blur w-fit">{spot.name}</h2>
                            <div className="flex gap-0.5 mt-1 items-start">
                                {spot.spot_types.map((type, i) => (
                                    <span className="tag" key={i} >
                                        {getSpotType(type.name)}
                                    </span>
                                )
                                )}
                            </div>
                        </div>
                    </button>
                    <div className="max-w-3 md:max-w-2.5 bg-bg-rgba bg-blur justify-center flex items-start">
                        <ButtonContainer variant="favorite" spot={spot} onEdit={() => navigate(redirecttoSpotUrl(spot.slug))} />
                    </div>
                </div>
            </div>
        );

    if (type === "submitted")
        return (
            <div className="submitted-card-container">
                <button
                    className="card p-0 w-8 h-8 button-shadow relative hover:-translate-px"
                    onClick={() => navigate(redirecttoSpotUrl(spot.slug))}
                    aria-label="Go to spot page"
                >
                    <MapContainer
                        center={[spot.coordinates[0].lat, spot.coordinates[0].lon]}
                        zoom={12}
                        dragging={false}
                        scrollWheelZoom={false}
                        zoomControl={false}
                        doubleClickZoom={false}
                        keyboard={false}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            url={layers[0].url}
                        />
                        <Polyline
                            positions={coords}
                            pathOptions={{
                                color: "var(--color-yellow-2)",
                                weight: 5,
                            }}
                        />
                        <FitBounds coordinates={spot.coordinates} />
                        <Marker position={coords[0]} icon={startIcon} />
                        {coords.length > 1 && <Marker position={coords[coords.length - 1]} icon={endIcon} />}
                    </MapContainer>
                </button>
                <p className="text-[0.7rem] text-center px-0.5 italic line-clamp-2">{spot.name}</p>
            </div>
        )
}