import { LocateFixed, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { LayerGroup, LayersControl, MapContainer, TileLayer, ZoomControl, useMapEvents } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { Button } from "../../../../components/Button/Button";
import { Loading } from "../../../../components/Loading/Loading";
import { getBrowserPosition } from "../../../../services/geolocation";
import type { MapCoordinates } from "../../../../types/geolocation_types";
import type { SpotType, SpotWithTypes } from '../../../../types/spots_types';
import { handleAria } from "../../../../utils/helpers";
import { useAuth } from "../../../auth/hooks/useAuth";
import { layers } from "../../config/leaflet";
import { SPOT_TYPES } from "../../config/spots";
import { useSpots } from "../../hooks/useSpots";
import { GuestMarker } from "../GuestMarker/GuestMarker";
import { ReCenterMap } from "../ReCenterMap/ReCenterMap";
import { RouteDisplay } from "../RouteDisplay/RouteDisplay";
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

const MapEvents = ({ onPopupClose }: { onPopupClose: () => void }) => {
    useMapEvents({
        popupclose: onPopupClose
    });
    return null;
};

export function Map({ zoom }: { zoom: number }) {
    const { profile, loading: loadingProfile } = useAuth();
    const [center, setCenter] = useState<MapCoordinates | null>(null);
    const [checkedTypes, setCheckedTypes] = useState<SpotType[]>([]);
    const expandFiltersRef = useRef<HTMLInputElement>(null)
    const { spots, loading } = useSpots();
    const [selectedSpot, setSelectedSpot] = useState<SpotWithTypes | null>(null)

    const spotTypes = useMemo(() => {
        if (!spots) return [];
        return [...new Set(spots.flatMap(spot => spot.spot_spot_types
            .filter(s => s.spot_types)
            .map(s => s.spot_types.name as SpotType)
        )
        )];
    }, [spots]);

    const trackUser = async () => {
        const { data } = await getBrowserPosition();
        if (data) {
            setCenter([data.lat, data.lon]);
        }
    };

    useEffect(() => {
        if (loadingProfile) return;
        const loadCenter = async () => {
            if (profile && (profile.home_lat && profile.home_lon))
                setCenter([profile.home_lat, profile.home_lon])
            else await trackUser();
        }
        loadCenter();
    }, [loadingProfile]);

    useEffect(() => {
        if (spotTypes.length) setCheckedTypes(spotTypes);
    }, [spotTypes]);

    const handleTypeChange = (filter: SpotType) => {
        setCheckedTypes(types => types.includes(filter)
            ? types.filter(type => type !== filter)
            : [...types, filter])
    };

    return (
        <div className="map-container">
            {loading && <div className="absolute w-full top-1/2 -translate-y-1/2"><Loading /></div>}
            {!loading && center &&
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
                        <div className="flex gap-0.5 mx-0.5 relative md:items-end">
                            <div>
                                <div className="bg-blur" id="spot-type-filters">
                                    {spotTypes.map(type => (
                                        <label className="map-label" key={type}>
                                            <input
                                                type="checkbox"
                                                checked={checkedTypes.includes(type)}
                                                onChange={() => handleTypeChange(type)}
                                            />
                                            {SPOT_TYPES.filter(spot => spot.value === type).map(spot => spot.label)}
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
                            </div>
                            <Button
                                style="icon"
                                className="track-me-btn"
                                aria-label="Track my current location"
                                onClick={trackUser}>
                                <LocateFixed aria-hidden fill="white" className="track-icon" />
                            </Button>
                        </div>
                    </Control>
                    <ZoomControl position="bottomright" />
                    <CoordinatePicker />
                    {!loading && spots &&
                        <LayerGroup>
                            {spots
                                .filter(spot =>
                                    spot.spot_spot_types.some(s =>
                                        s.spot_types && checkedTypes.includes(s.spot_types.name)
                                    )
                                )
                                .map(spot => (
                                    <SpotMarker
                                        key={spot.id}
                                        spot={spot}
                                        onMarkerClick={() => setSelectedSpot(spot)}
                                        dimmed={selectedSpot !== null && selectedSpot.id !== spot.id}
                                    />
                                ))}
                        </LayerGroup>
                    }
                    {profile && <UserMarker profile={profile} center={center} />}
                    {!profile && <GuestMarker center={center} />}
                    <ReCenterMap lat={center[0]} lon={center[1]} />
                    {selectedSpot && <RouteDisplay data={selectedSpot.coordinates} />}
                    <MapEvents onPopupClose={() => setSelectedSpot(null)} />
                </MapContainer>
            }
        </div>
    )
}