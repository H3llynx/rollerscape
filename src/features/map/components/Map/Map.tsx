import type { LatLngExpression } from "leaflet";
import { LocateFixed, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { LayerGroup, LayersControl, MapContainer, TileLayer, ZoomControl, useMapEvents } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { Button } from "../../../../components/Button/Button";
import { getBrowserPosition } from "../../../../services/geolocation";
import type { SpotType } from "../../../../types/spots_types";
import { handleAria } from "../../../../utils/helpers";
import { useAuth } from "../../../auth/hooks/useAuth";
import { layers } from "../../config/leaflet";
import { useSpots } from "../../hooks/useSpots";
import { SpotMarker } from "../SpotMarker/SpotMarker";
import { UserMarker } from "../UserMarker/UserMarker";
import "./Map.css";

const CoordinatePicker = () => {
    useMapEvents({
        click: (e) => {
            const { lat, lng } = e.latlng;
            console.log(`{ "lat": ${lat}, "lon": ${lng} }`);
        }
    });
    return null;
};

export function Map({ zoom }: { zoom: number }) {
    const { profile } = useAuth();
    const { loading, spots } = useSpots();
    const [center, setCenter] = useState<LatLngExpression | null>(null);
    const [checkedTypes, setCheckedTypes] = useState<SpotType[]>([]);
    const expandFiltersRef = useRef<HTMLInputElement>(null)

    const spotTypes = useMemo(() => {
        if (!spots) return [];
        return [...new Set(spots.flatMap(spot => spot.spot_types))];
    }, [spots])

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

    useEffect(() => {
        if (spotTypes.length) setCheckedTypes(spotTypes);
    }, [spotTypes]);

    const handleTypeChange = (filter: SpotType) => {
        setCheckedTypes(types => types.includes(filter)
            ? types.filter(type => type !== filter)
            : [...types, filter])
    }


    return (
        <div className="map-container">
            {center &&
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
                    <Control position="bottomleft">
                        <div className="bg-blur" id="spot-type-filters">
                            {spotTypes.map(type => (
                                <label className="map-label" key={type}>
                                    <input
                                        type="checkbox"
                                        checked={checkedTypes.includes(type)}
                                        onChange={() => handleTypeChange(type)}
                                    />
                                    {type}
                                </label>
                            ))}
                        </div>
                        <label className="expand-filters-cta" aria-label="Expand filters" htmlFor="expand-filters">
                            <SlidersHorizontal aria-hidden className="expand-filters-icon" />
                            <input className="sr-only"
                                type="checkbox"
                                id="expand-filters"
                                aria-expanded="false"
                                aria-controls="spot-type-filters"
                                ref={expandFiltersRef}
                                onChange={() => handleAria(expandFiltersRef)}
                            />
                        </label>
                    </Control>
                    <Control position="bottomleft">
                        <Button style="icon" className="track-me-btn" aria-label="Track my current location">
                            <LocateFixed aria-hidden fill="white" className="track-icon" />
                        </Button>
                    </Control>
                    <ZoomControl position="bottomright" />
                    <CoordinatePicker />
                    {!loading && spots &&
                        <LayerGroup>
                            {spots
                                .filter(spot =>
                                    spot.spot_types.some(type => checkedTypes.includes(type))
                                )
                                .map(spot => (
                                    <SpotMarker
                                        key={spot.id} spot={spot}
                                    />
                                ))}
                        </LayerGroup>
                    }
                    {profile && <UserMarker profile={profile} center={center} />}
                </MapContainer>
            }
        </div>
    )
}