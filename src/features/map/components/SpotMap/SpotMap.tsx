import { SlidersHorizontal } from "lucide-react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { LayerGroup, useMapEvents } from "react-leaflet";
import { useSearchParams } from "react-router";
import { Dialog } from "../../../../components/Dialog/Dialog";
import { GridLeftPanel } from "../../../../components/GridLeftPanel/GridLeftPanel";
import { Loading } from "../../../../components/Loading/Loading";
import { SPOT_TYPES } from "../../../../config/spots";
import type { MapCoordinates } from "../../../../types/geolocation_types";
import type { SpotFullInfo, SpotType } from '../../../../types/spots_types';
import { handleAria } from "../../../../utils/helpers";
import { SpotDescription } from "../../../spot/components/SpotDescription/SpotDescription";
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
    const [selectedSpot, setSelectedSpot] = useState<SpotFullInfo | null>(null);
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

    useEffect(() => {
        if (!selectedSpot) return;
        const newParams = new URLSearchParams();
        if (selectedSpot) newParams.set(selectedSpot.slug, "expanded");
        setSearchParams(newParams);
    }, [selectedSpot]);

    useEffect(() => {
        if (!spots) return;
        const spotToExpand = spots.find(spot => searchParams.get(spot.slug) === "expanded");
        if (spotToExpand) {
            const expandedSpotTypes: SpotType[] = []
            spotToExpand.spot_spot_types.forEach(type => expandedSpotTypes.push(type.name))
            setCheckedTypes(expandedSpotTypes);
            setSelectedSpot(spotToExpand);
        }
    }, [spots]);

    const handleClose = () => {
        dialogRef.current?.close();
        setError(null);
    };

    const handleTypeChange = (filter: SpotType) => {
        setCheckedTypes(types => types.includes(filter)
            ? types.filter(type => type !== filter)
            : [...types, filter])
    };

    const handleMarkerClick = (spot: SpotFullInfo) => {
        if (selectedSpot === spot) setSelectedSpot(null);
        else setSelectedSpot(spot);
    }

    const otherControls = (
        <div className="pb-1">
            <div id="spot-type-filters">
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
        <>
            <GridLeftPanel collapsed={!selectedSpot}>
                <div className="left-panel scroll">
                    {selectedSpot &&
                        <div className="left-panel-container">
                            <button
                                className="md:hidden flex justify-center w-full p-[8px] h-2"
                                aria-label="Hide spot description"
                                onClick={() => setSelectedSpot(null)}
                            >
                                <div className="h-[6px] rounded-full w-[90px] bg-border opacity-60"></div>
                            </button>
                            <SpotDescription spot={selectedSpot} setSelectedSpot={setSelectedSpot} />
                        </div>
                    }
                </div>
                {loading && <div className="absolute w-full top-1/2 -translate-y-1/2"><Loading /></div>}
                {!loading && center &&
                    <div className="map-container">
                        <Map
                            center={center}
                            zoom={zoom}
                            other={spots && spots.length > 0 && otherControls}
                            trackUser={trackUser}
                        >
                            {!loading && spots &&
                                <LayerGroup>
                                    {spots
                                        .filter(spot =>
                                            spot.spot_spot_types.some(type => checkedTypes.includes(type.name))
                                        )
                                        .map(spot => {
                                            if (spot.location_type === "point")
                                                return (
                                                    <SpotMarker
                                                        key={spot.id}
                                                        spot={spot}
                                                        position={[spot.coordinates[0].lat, spot.coordinates[0].lon]}
                                                        onMarkerClick={() => handleMarkerClick(spot)}
                                                        dimmed={selectedSpot !== null && selectedSpot.id !== spot.id}
                                                    />
                                                )
                                            if (spot.location_type === "route") {
                                                const start = [spot.coordinates[0].lat, spot.coordinates[0].lon];
                                                const end = [spot.coordinates[spot.coordinates.length - 1].lat, spot.coordinates[spot.coordinates.length - 1].lon];
                                                return (
                                                    <Fragment key={spot.id}>
                                                        <SpotMarker
                                                            key={`${spot.id}-start`}
                                                            spot={spot}
                                                            position={start as MapCoordinates}
                                                            onMarkerClick={() => handleMarkerClick(spot)}
                                                            dimmed={selectedSpot !== null && selectedSpot.id !== spot.id}
                                                        />
                                                        <SpotMarker
                                                            key={`${spot.id}-end`}
                                                            spot={spot}
                                                            position={end as MapCoordinates}
                                                            onMarkerClick={() => handleMarkerClick(spot)}
                                                            dimmed={selectedSpot !== null && selectedSpot.id !== spot.id}
                                                        />
                                                    </Fragment>
                                                )
                                            }
                                        }
                                        )}
                                </LayerGroup>
                            }
                            {profile && <UserMarker profile={profile} center={center} />}
                            {!profile && <GuestMarker center={center} />}
                            <ReCenterMap lat={center[0]} lon={center[1]} />
                            {selectedSpot && <RouteDisplay data={selectedSpot.coordinates} selected={true} />}
                            <MapEvents onPopupClose={() => setSelectedSpot(null)} />
                        </Map>
                    </div>
                }
            </GridLeftPanel >
            <Dialog ref={dialogRef} style="error" close={handleClose}>
                <p>{error}</p>
            </Dialog>
        </>
    )
}