import { SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { LayerGroup, useMapEvents } from "react-leaflet";
import { useSearchParams } from "react-router";
import { Dialog } from "../../../../components/Dialog/Dialog";
import { Loading } from "../../../../components/Loading/Loading";
import { SPOT_TYPES } from "../../../../config/spots";
import type { SpotType, SpotWithTypes } from '../../../../types/spots_types';
import { handleAria } from "../../../../utils/helpers";
import { useCenter } from "../../hooks/useCenter";
import { useSpots } from "../../hooks/useSpots";
import { GuestMarker } from "../GuestMarker/GuestMarker";
import { Map } from "../Map/Map";
import { ReCenterMap } from "../ReCenterMap/ReCenterMap";
import { RouteDisplay } from "../RouteDisplay/RouteDisplay";
import { SpotMarker } from "../SpotMarker/SpotMarker";
import { UserMarker } from "../UserMarker/UserMarker";
import "./SpotMap.css";

const MapEvents = ({ onPopupClose }: { onPopupClose: () => void }) => {
    useMapEvents({
        popupclose: onPopupClose
    });
    return null;
};

export function SpotMap({ zoom }: { zoom: number }) {
    const [checkedTypes, setCheckedTypes] = useState<SpotType[]>([]);
    const expandFiltersRef = useRef<HTMLInputElement>(null)
    const { spots, loading } = useSpots();
    const [selectedSpot, setSelectedSpot] = useState<SpotWithTypes | null>(null);
    const { center, error, setError, trackUser, profile } = useCenter();

    const dialogRef = useRef<HTMLDialogElement>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const spotTypes = useMemo(() => {
        if (!spots) return [];
        return [...new Set(spots.flatMap(spot => spot.spot_spot_types.map(type => type.name as SpotType)))];
    }, [spots]);

    useEffect(() => {
        if (error) {
            dialogRef.current?.showModal();
        }
    }, [error]);

    useEffect(() => {
        if (!spotTypes.length) return;
        if (searchParams.size === 0) {
            setCheckedTypes(spotTypes);
        } else {
            const filtersToCheck = spotTypes.filter(type => searchParams.get(type) === "");
            setCheckedTypes(filtersToCheck);
        }
    }, [spotTypes]);

    useEffect(() => {
        if (!spotTypes.length) return;
        const newParams = new URLSearchParams();
        if (spotTypes.length === checkedTypes.length) {
            setSearchParams({});
            return
        }
        checkedTypes.forEach(type => {
            newParams.set(type, "")
        });
        setSearchParams(newParams);
    }, [checkedTypes]);

    const handleClose = () => {
        dialogRef.current?.close();
        setError(null);
    };

    const handleTypeChange = (filter: SpotType) => {
        setCheckedTypes(types => types.includes(filter)
            ? types.filter(type => type !== filter)
            : [...types, filter])
    };

    const filterTsx = (
        <div>
            <div className="bg-blur" id="spot-type-filters">
                {spotTypes.map(type => (
                    <label className="map-label" key={type}>
                        <input
                            type="checkbox"
                            checked={checkedTypes.includes(type)}
                            onChange={() => handleTypeChange(type)}
                        />
                        {SPOT_TYPES
                            .filter(spot => spot.value === type)
                            .map(spot => spot.label)}
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
    )

    return (
        <div className="map-container">
            {loading && <div className="absolute w-full top-1/2 -translate-y-1/2"><Loading /></div>}
            {!loading && center &&
                <Map
                    center={center}
                    zoom={zoom}
                    other={filterTsx}
                    trackUser={trackUser}
                >
                    {!loading && spots &&
                        <LayerGroup>
                            {spots
                                .filter(spot =>
                                    spot.spot_spot_types.some(type => checkedTypes.includes(type.name))
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
                    {selectedSpot && <RouteDisplay data={selectedSpot.coordinates} selected={true} />}
                    <MapEvents onPopupClose={() => setSelectedSpot(null)} />
                </Map>
            }
            <Dialog ref={dialogRef} style="error" close={handleClose}>
                <p>{error}</p>
            </Dialog>
        </div>
    )
}