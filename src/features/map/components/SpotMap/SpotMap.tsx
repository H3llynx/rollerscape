import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { LayerGroup } from "react-leaflet";
import { useSearchParams } from "react-router";
import { Dialog } from "../../../../components/Dialog/Dialog";
import { GridLeftPanel } from "../../../../components/GridLeftPanel/GridLeftPanel";
import { Loading } from "../../../../components/Loading/Loading";
import type { MapCoordinates } from "../../../../types/geolocation_types";
import type { SpotFullInfo, SpotType } from '../../../../types/spots_types';
import { SpotLeftPanel } from "../../../spot_management/components/SpotLeftPanel/SpotLeftPanel";
import { useCenter } from "../../hooks/useCenter";
import { useSpots } from "../../hooks/useSpots";
import { FlyToSpot } from "../FlyToSpot/FlyToSpot";
import { FlyToUser } from "../FlyToUser/FlyToUser";
import { GuestMarker } from "../GuestMarker/GuestMarker";
import { Map } from "../Map/Map";
import { MapFilters } from "../MapFilters/MapFilters";
import { RouteDisplay } from "../RouteDisplay/RouteDisplay";
import { SpotMarker } from "../SpotMarker/SpotMarker";
import { UserMarker } from "../UserMarker/UserMarker";
import "./SpotMap.css";

export function SpotMap({ zoom }: { zoom: number }) {
    const { spots, loading, selectedSpot, setSelectedSpot } = useSpots();
    const { center, error, setError, trackUser, profile } = useCenter();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [checkedTypes, setCheckedTypes] = useState<SpotType[]>([]);

    useEffect(() => {
        if (error) {
            dialogRef.current?.showModal();
        }
    }, [error]);

    const spotTypes = useMemo(() => {
        if (!spots) return [];
        return [...new Set(spots.flatMap(spot => spot.spot_types.map(type => type.name as SpotType)))];
    }, [spots]);

    useEffect(() => {
        if (!spotTypes.length) return;
        const params = searchParams.getAll("type");
        const filtersToCheck = spotTypes.filter(type => params.includes(type));
        if (filtersToCheck.length > 0) {
            setCheckedTypes(filtersToCheck);
            return;
        }
        const defaultFilters: SpotType[] = profile && profile.preferred_spot_types && profile.preferred_spot_types.length > 0
            ? spotTypes.filter(type => profile.preferred_spot_types?.includes(type))
            : spotTypes
        setCheckedTypes(defaultFilters);
    }, [spotTypes]);

    useEffect(() => {
        if (!spotTypes.length) return;
        const newParams = new URLSearchParams();
        if (spotTypes.length === checkedTypes.length) {
            setSearchParams({});
            return
        }
        checkedTypes.forEach(type => {
            newParams.append("type", type);
        });
        setSearchParams(newParams);
    }, [checkedTypes]);

    useEffect(() => {
        if (!selectedSpot) return;
        const newParams = new URLSearchParams();
        if (selectedSpot) {
            newParams.set("spot", selectedSpot.slug);
            setSearchParams(newParams);
        }
    }, [selectedSpot]);

    useEffect(() => {
        if (!spots) return;
        const spotToExpand = spots.find(spot => searchParams.get("spot") === spot.slug);
        if (spotToExpand) {
            const expandedSpotTypes: SpotType[] = []
            spotToExpand.spot_types.forEach(type => expandedSpotTypes.push(type.name))
            setCheckedTypes(expandedSpotTypes);
            setSelectedSpot(spotToExpand);
        }
    }, [spots]);

    const handleClose = () => {
        dialogRef.current?.close();
        setError(null);
    };

    const handleMarkerClick = (spot: SpotFullInfo) => {
        if (selectedSpot === spot) setSelectedSpot(null);
        else setSelectedSpot(spot);
    }

    const otherControls = (
        <MapFilters
            spotTypes={spotTypes}
            checkedTypes={checkedTypes}
            setCheckedTypes={setCheckedTypes}
        />
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
                            <SpotLeftPanel />
                        </div>
                    }
                </div>
                {loading && <div className="absolute w-full top-1/2 -translate-y-1/2"><Loading /></div>}
                {!loading && center &&
                    <Map
                        center={center}
                        zoom={zoom}
                        other={spots && spots.length > 0 && otherControls}
                        trackUser={trackUser}
                    >
                        {!loading && spots &&
                            <LayerGroup key={`${spots?.length}-${checkedTypes.length}`}>
                                {spots
                                    .filter(spot =>
                                        spot.spot_types.some(type => checkedTypes.includes(type.name))
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
                        <FlyToUser center={center} />
                        <FlyToSpot spot={selectedSpot} />
                        {selectedSpot && <RouteDisplay data={selectedSpot.coordinates} selected={true} />}
                    </Map>
                }
            </GridLeftPanel >
            <Dialog ref={dialogRef} style="error" close={handleClose}>
                <p>{error}</p>
            </Dialog>
        </>
    )
}