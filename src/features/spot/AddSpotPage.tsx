import { MapPinX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Marker } from "react-leaflet";
import { useNavigate } from "react-router";
import { Button } from "../../components/Button/Button";
import { Dialog } from "../../components/Dialog/Dialog";
import { GridLeftPanel } from "../../components/GridLeftPanel/GridLeftPanel";
import { Header } from "../../components/Header/Header";
import { databases } from "../../config/databases";
import { spotErrors } from "../../config/errors";
import { addSpotFields } from "../../config/spots";
import { insertDataWithJunctions, type Table } from "../../services/data";
import { fetchRoute, reverseGeocode } from "../../services/geolocation";
import { getSpotTypes, getTrafficLevel } from "../../services/spots";
import type { Coordinates, OsrmRoute, Route, RouteCoordinates } from "../../types/geolocation_types";
import type { JunctionInsert, RouteGenMode, Spot, SpotType, TrafficLevel } from "../../types/spots_types";
import { createSlug, osrmToJsonCoords } from "../../utils/helpers";
import { Map } from "../map/components/Map/Map";
import { ReCenterMap } from "../map/components/ReCenterMap/ReCenterMap";
import { RouteDisplay } from "../map/components/RouteDisplay/RouteDisplay";
import { UserMarker } from "../map/components/UserMarker/UserMarker";
import { useCenter } from "../map/hooks/useCenter";
import { AddSpotForm } from "./components/AddSpotForm/AddSpotForm";
import { LocationTypeForm } from "./components/LocationTypeForm/LocationTypeForm";
import { CoordinatePickerPoint, CoordinatePickerRoute, estimateDistanceFromGpx } from "./utils";

export function AddSpotPage() {
    const { center, trackUser, profile } = useCenter();
    const { name, location_type, coordinates, description, surface_quality, spot_types, traffic_level, photos } = addSpotFields;
    const [confirmedLocationType, setConfirmedLocationType] = useState<boolean>(false);
    const [locationType, setLocationType] = useState<Spot["location_type"]>(location_type.options[0] as Spot["location_type"]);
    const [routeGenMode, setRouteGenMode] = useState<RouteGenMode | null>(null);
    const [spotCoordinates, setSpotCoordinates] = useState<Coordinates[] | null>(null)
    const { setValue } = useForm();
    const navigate = useNavigate();
    const [routeCoordinates, setrouteCoordinates] = useState<RouteCoordinates>({ start: null, end: null });
    const [routes, setRoutes] = useState<Route[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<number>(0);
    const [gpxCoordinates, setGpxCoordinates] = useState<Coordinates[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);

    const handleRoutePick = (lat: number, lon: number, type: "start" | "end" | "middle") => {
        setrouteCoordinates({ ...routeCoordinates, [type]: { lat, lon } });
    };

    const handleSetLocationType = () => {
        setLocationType(locationType);
        setConfirmedLocationType(true);
        setValue(location_type.db_key, locationType);
        if (gpxCoordinates) setSpotCoordinates(gpxCoordinates);
    };

    useEffect(() => {
        if (error) {
            dialogRef.current?.showModal();
        }
    }, [error]);

    const handleClose = () => {
        dialogRef.current?.close();
        setError(null);
    };

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
        if (locationType === "route" && routes.length > 0) {
            setSelectedRoute(0);
            setSpotCoordinates(routes[selectedRoute].coordinates)
        }
    }, [selectedRoute, routes, locationType])

    const getRouteLength = () => {
        if (locationType !== "route") return;
        return gpxCoordinates
            ? estimateDistanceFromGpx(gpxCoordinates)
            : Number((routes[selectedRoute].distance / 1000).toFixed(2));
    };

    const addSpot = async (newSpot: Record<string, unknown>) => {
        if (!profile) return;
        if (!spotCoordinates) {
            setError(spotErrors.add.missing_coordinates);
            return
        };

        const coords = newSpot[coordinates.db_key] as Coordinates[];
        const geo = await reverseGeocode(coords[0]);
        const slug = createSlug(`${newSpot[name.db_key]}-${geo.city}`);
        const selectedTypes = newSpot[spot_types.db_key] as SpotType[];
        const { data: typeRows } = await getSpotTypes(selectedTypes);
        const selectedLevel = newSpot[traffic_level.db_key] as TrafficLevel;
        const { data: levelRow } = await getTrafficLevel(selectedLevel);
        const values = {
            name: newSpot[name.db_key],
            description: newSpot[description.db_key] || null,
            location_type: locationType,
            coordinates: coords,
            length_km: getRouteLength(),
            surface_quality: Number(newSpot[surface_quality.db_key]),
            city: geo.city,
            country: geo.country,
            address: geo.name,
            photos: newSpot[photos.db_key as keyof Spot] as string[] || [],
            slug,
            created_by: profile.id,
        }

        const junctions: JunctionInsert[] = [
            { table: "spot_spot_types", fKey: "spot_type_id", values: typeRows?.map(row => row.id) ?? [] },
            ...(levelRow ? [{ table: "spot_traffic_levels" as Table, fKey: "traffic_level_id", values: [levelRow.id] }] : [])
        ]

        const { error } = await insertDataWithJunctions(databases.spots, values, junctions);
        if (error) {
            setError(spotErrors.add.generic)
            return
        }
        navigate(`/?${slug}=expanded`);
    }

    const resetRoute = locationType === "route" && routeCoordinates.start
        ? (<Button
            style="primary"
            className="my-auto order-1 bg-bg-main text-text"
            onClick={() => {
                setrouteCoordinates({ start: null, end: null });
                setRoutes([]);
                setSpotCoordinates(null);
            }
            }>
            <MapPinX width={20} /> Reset
        </Button>)
        : ""

    return (
        <>
            <Header style="map" />
            {profile && center &&
                <GridLeftPanel collapsed={!confirmedLocationType}>
                    <div className="left-panel scroll">
                        {confirmedLocationType &&
                            <div className="left-panel-container p-2 md:pt-8">
                                <AddSpotForm
                                    center={center!}
                                    locationType={locationType}
                                    spotCoordinates={spotCoordinates}
                                    setSpotCoordinates={setSpotCoordinates}
                                    onSubmit={addSpot}
                                />
                            </div>
                        }
                    </div>
                    <Map center={center} zoom={14} trackUser={trackUser} other={resetRoute}>
                        <ReCenterMap lat={center[0]} lon={center[1]} />
                        {confirmedLocationType && !gpxCoordinates &&
                            <>
                                {locationType === "point" &&
                                    <CoordinatePickerPoint onPick={(lat, lon) => setSpotCoordinates([{ lat, lon }])} />}
                                {locationType === "route" && !routeCoordinates.middle &&
                                    <CoordinatePickerRoute onPick={handleRoutePick} routeCoords={routeCoordinates} />}
                            </>
                        }
                        <UserMarker profile={profile} center={center} />
                        {spotCoordinates &&
                            <Marker position={[spotCoordinates[0].lat, spotCoordinates[0].lon]} />
                        }
                        {routeCoordinates.start && routes.length === 0 &&
                            <Marker position={[routeCoordinates.start.lat, routeCoordinates.start.lon]} />}
                        {routeCoordinates.end &&
                            <Marker position={[routeCoordinates.end.lat, routeCoordinates.end.lon]} />}
                        {routeCoordinates.middle &&
                            <Marker position={[routeCoordinates.middle.lat, routeCoordinates.middle.lon]} />}
                        {routes.map((route, i) => (
                            <RouteDisplay
                                key={i}
                                data={route.coordinates}
                                selected={selectedRoute === i}
                                onSelect={() => setSelectedRoute(i)}
                            />
                        ))}
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