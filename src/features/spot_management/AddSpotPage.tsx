import { MapPinPenIcon, MapPinX, RouteIcon, Undo2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "../../components/Button/Button";
import { Dialog } from "../../components/Dialog/Dialog";
import { GridLeftPanel } from "../../components/GridLeftPanel/GridLeftPanel";
import { Header } from "../../components/Header/Header";
import { databases } from "../../config/databases";
import { spotErrors } from "../../config/errors";
import { spotFormFields } from "../../config/spots";
import { redirecttoSpotUrl } from "../../config/urls";
import { insertDataWithJunctions } from "../../services/data";
import { fetchRoute, reverseGeocode } from "../../services/geolocation";
import { getSpotTypes, getTrafficLevels } from "../../services/spots";
import type { Coordinates, OsrmRoute, Route, RouteCoordinates } from "../../types/geolocation_types";
import type { JunctionInsert, RouteGenMode, Spot, SpotType, TrafficLevel } from "../../types/spots_types";
import { createSlug, osrmToJsonCoords } from "../../utils/helpers";
import { FlyToUser } from "../map/components/FlyToUser/FlyToUser";
import { Map } from "../map/components/Map/Map";
import { RouteDisplay } from "../map/components/RouteDisplay/RouteDisplay";
import { UserMarker } from "../map/components/UserMarker/UserMarker";
import { useCenter } from "../map/hooks/useCenter";
import { useSpots } from "../map/hooks/useSpots";
import { AddMarker } from "./components/AddMarker/AddMarker";
import { LocationTypeForm } from "./components/LocationTypeForm/LocationTypeForm";
import { SpotForm } from "./components/SpotForm/SpotForm";
import { CoordinatePicker, estimateDistanceFromCoords } from "./utils";

export function AddSpotPage() {
    const { center, trackUser, profile } = useCenter();
    const { loadSpots } = useSpots();
    const { name, location_type, coordinates, description, surface_quality, spot_types, traffic_levels, photos } = spotFormFields;
    const { setValue } = useForm();
    const navigate = useNavigate();
    const [confirmedLocationType, setConfirmedLocationType] = useState<boolean>(false);
    const [locationType, setLocationType] = useState<Spot["location_type"]>(location_type.options[0] as Spot["location_type"]);
    const [routeGenMode, setRouteGenMode] = useState<RouteGenMode | null>(null);
    const [spotCoordinates, setSpotCoordinates] = useState<Coordinates[]>([]);
    const [routeCoordinates, setRouteCoordinates] = useState<RouteCoordinates>({ start: null, end: null });
    const [routes, setRoutes] = useState<Route[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<number>(0);
    const [custom, setCustom] = useState<boolean>(false);
    const [gpxCoordinates, setGpxCoordinates] = useState<Coordinates[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const customDistanceRef = useRef(0);

    useEffect(() => {
        if (error) {
            dialogRef.current?.showModal();
        }
    }, [error]);

    useEffect(() => {
        const getRoute = async () => {
            if (routeCoordinates.start && routeCoordinates.end) {
                const data = await fetchRoute(routeCoordinates);
                if (data) {
                    const converted = data.map((route: OsrmRoute) => ({
                        coordinates: osrmToJsonCoords(route.geometry.coordinates),
                        distance: route.distance,
                    }));
                    setRoutes(converted);
                }
            }
        };
        getRoute();
    }, [routeCoordinates]);

    useEffect(() => {
        if (locationType === "route" && !custom && routes.length > 0) {
            setSpotCoordinates(routes[selectedRoute].coordinates)
        }
    }, [selectedRoute, routes, locationType, custom]);

    const handleClose = () => {
        dialogRef.current?.close();
        setError(null);
    };

    const handleSetLocationType = () => {
        setLocationType(locationType);
        setConfirmedLocationType(true);
        setValue(location_type.db_key, locationType);
        if (gpxCoordinates) setSpotCoordinates(gpxCoordinates);
    };

    const resetRoute = () => {
        setRouteCoordinates({ start: null, end: null });
        setRoutes([]);
        setSpotCoordinates([]);
        customDistanceRef.current = 0;
    }

    const handleCustom = () => {
        setCustom(!custom);
        resetRoute();
    }

    const handleRoutePick = (lat: number, lon: number) => {
        if (!custom) {
            if (!routeCoordinates.start) setRouteCoordinates({ ...routeCoordinates, start: { lat, lon } });
            else if (!routeCoordinates.end) setRouteCoordinates({ ...routeCoordinates, end: { lat, lon } });
        } else {
            if (spotCoordinates.length > 0) {
                const distance = estimateDistanceFromCoords([spotCoordinates[spotCoordinates.length - 1], { lat, lon }]);
                customDistanceRef.current += distance;
            }
            setSpotCoordinates(prev => [...prev, { lat, lon }]);
        }
    };

    const handleUndoPoint = () => {
        if (spotCoordinates.length > 1) {
            const distance = estimateDistanceFromCoords([
                spotCoordinates[spotCoordinates.length - 2],
                spotCoordinates[spotCoordinates.length - 1]
            ]);
            customDistanceRef.current -= distance;
        }
        setSpotCoordinates(prev => prev.slice(0, -1));
    };

    const getRouteLength = () => {
        if (locationType !== "route") return;
        if (gpxCoordinates) return estimateDistanceFromCoords(gpxCoordinates);
        return custom
            ? customDistanceRef.current
            : Number((routes[selectedRoute].distance / 1000).toFixed(2));
    };

    const addSpot = async (newSpot: Record<string, unknown>) => {
        if (!profile) return;
        if (!spotCoordinates.length) {
            setError(spotErrors.add.missing_coordinates);
            return
        }
        const selectedLevels = newSpot[traffic_levels.db_key] as TrafficLevel[];
        const selectedTypes = newSpot[spot_types.db_key] as SpotType[];
        const coords = newSpot[coordinates.db_key] as Coordinates[];
        const geo = await reverseGeocode(coords[0]);
        const slug = createSlug(`${newSpot[name.db_key]}-${geo.city}`);
        const { data: typeRows } = await getSpotTypes(selectedTypes);
        const { data: levelRows } = await getTrafficLevels(selectedLevels);

        const values = {
            name: newSpot[name.db_key],
            description: newSpot[description.db_key] || null,
            location_type: locationType,
            coordinates: coords,
            length_km: getRouteLength(),
            surface_quality: newSpot[surface_quality.db_key],
            city: geo.city,
            country: geo.country,
            address: geo.name,
            photos: newSpot[photos.db_key as keyof Spot] as string[] || [],
            slug,
            created_by: profile.id,
        }

        const junctions: JunctionInsert[] = [
            { table: "spot_spot_types", fKey: "spot_type_id", values: typeRows?.map(row => row.id) ?? [] },
            { table: "spot_traffic_levels", fKey: "traffic_level_id", values: levelRows?.map(row => row.id) ?? [] }
        ]

        const { error } = await insertDataWithJunctions(databases.spots, values, junctions);
        if (error) {
            setError(spotErrors.add.generic)
            return
        }
        await loadSpots();
        navigate(`${redirecttoSpotUrl(slug)}`);
    }

    const otherControls = (
        <>
            {locationType === "route" &&
                <>
                    {(routeCoordinates.start || spotCoordinates.length) &&
                        <div className="flex gap-1 order-1 my-auto">
                            <Button
                                className="my-auto"
                                onClick={resetRoute}>
                                <MapPinX width={20} /> Reset
                            </Button>
                            <Button
                                style="icon"
                                className="bg-dark-3 border border-grey text-text px-0.5"
                                onClick={handleUndoPoint}
                                aria-label="Undo last point">
                                <Undo2 aria-hidden />
                            </Button>
                        </div>}
                    <div className="absolute bottom-5 left-2">
                        <Button style="tertiary" onClick={handleCustom} className=" bg-bg-rgba text-text px-0.5">
                            {custom ?
                                <>
                                    <RouteIcon />
                                    Get routes suggestions
                                </>
                                : <>
                                    <MapPinPenIcon />
                                    Create custom itinerary
                                </>}
                        </Button>
                    </div>
                </>
            }
        </>

    )
    return (
        <>
            <Header style="map" />
            {profile && center &&
                <GridLeftPanel collapsed={!confirmedLocationType}>
                    <div className="left-panel scroll">
                        {confirmedLocationType &&
                            <div className="left-panel-container px-2 pt-1.5 pb-2 md:pt-8">
                                <SpotForm
                                    isAdding
                                    locationType={locationType}
                                    spotCoordinates={spotCoordinates}
                                    onSubmit={addSpot}
                                />
                            </div>
                        }
                    </div>

                    <Map
                        center={center}
                        zoom={14}
                        trackUser={trackUser}
                        other={otherControls}
                    >
                        <FlyToUser center={center} />
                        {confirmedLocationType && !gpxCoordinates &&
                            <>
                                {locationType === "point" &&
                                    <CoordinatePicker onPick={(lat, lon) => setSpotCoordinates([{ lat, lon }])} />}
                                {locationType === "route" &&
                                    <CoordinatePicker onPick={handleRoutePick} routeCoords={routeCoordinates} />}
                            </>
                        }
                        <UserMarker />
                        {spotCoordinates.length > 0 && routes.length === 0 && !gpxCoordinates &&
                            <AddMarker position={[spotCoordinates[0].lat, spotCoordinates[0].lon]} />
                        }
                        {routeCoordinates.start && routes.length === 0 &&
                            <AddMarker position={[routeCoordinates.start.lat, routeCoordinates.start.lon]} />}
                        {routeCoordinates.end && routes.length === 0 &&
                            <AddMarker position={[routeCoordinates.end.lat, routeCoordinates.end.lon]} />}
                        {routes.map((route, i) => (
                            <RouteDisplay
                                key={i}
                                data={route.coordinates}
                                selected={selectedRoute === i}
                                onSelect={() => setSelectedRoute(i)}
                            />
                        ))}
                        {custom && spotCoordinates.length > 1 &&
                            <RouteDisplay
                                data={spotCoordinates}
                                selected
                            />
                        }
                        {gpxCoordinates &&
                            <RouteDisplay
                                data={gpxCoordinates}
                                selected
                            />
                        }
                    </Map>
                </GridLeftPanel>
            }



            {!confirmedLocationType &&
                <LocationTypeForm
                    locationType={locationType}
                    routeGenMode={routeGenMode}
                    setLocationType={setLocationType}
                    setRouteGenMode={setRouteGenMode}
                    setGpxCoordinates={setGpxCoordinates}
                    onSubmit={handleSetLocationType}
                />
            }
            <Dialog ref={dialogRef} style="error" close={handleClose}>
                <p>{error}</p>
            </Dialog>
        </>
    )
}