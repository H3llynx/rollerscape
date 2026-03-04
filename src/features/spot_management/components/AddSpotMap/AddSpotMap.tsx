import { CheckCircle, MapPinX, Undo2 } from "lucide-react";
import { useEffect, useState, type Dispatch, type RefObject, type SetStateAction } from "react";
import { useMediaQuery } from "react-responsive";
import CreateCustomButton from "../../../../assets/build-route.png";
import UseRouteButton from "../../../../assets/use-route.png";
import { Button } from "../../../../components/Button/Button";
import { Loading } from "../../../../components/Loading/Loading";
import { fetchRoute } from "../../../../services/geolocation";
import type { Coordinates, OsrmRoute, Route, RouteCoordinates } from "../../../../types/geolocation_types";
import type { Spot } from "../../../../types/spots_types";
import { osrmToJsonCoords } from "../../../../utils/helpers";
import { FlyToUser } from "../../../map/components/FlyToUser/FlyToUser";
import { Map } from "../../../map/components/Map/Map";
import { RouteDisplay } from "../../../map/components/RouteDisplay/RouteDisplay";
import { UserMarker } from "../../../map/components/UserMarker/UserMarker";
import { useCenter } from "../../../map/hooks/useCenter";
import { CoordinatePicker, estimateDistanceFromCoords } from "../../utils";
import { AddMarker } from "../AddMarker/AddMarker";
import { FlyToCoords } from "../FlyToCoords/FlyToCoords";
import "./AddSpotMap.css";

type AddSpotMap = {
    locationType: Spot["location_type"];
    confirmedLocationType: boolean;
    spotCoordinates: Coordinates[];
    setSpotCoordinates: Dispatch<SetStateAction<Coordinates[]>>
    routes: Route[];
    setRoutes: Dispatch<SetStateAction<Route[]>>
    selectedRoute: number;
    setSelectedRoute: Dispatch<SetStateAction<number>>;
    gpxCoordinates: Coordinates[] | null;
    custom: boolean;
    setCustom: Dispatch<SetStateAction<boolean>>;
    customDistanceRef: RefObject<number>;
    isAddingRoute: boolean;
    setIsAddingRoute: Dispatch<SetStateAction<boolean>>
}

export function AddSpotMap({
    locationType,
    confirmedLocationType,
    spotCoordinates,
    setSpotCoordinates,
    routes,
    setRoutes,
    selectedRoute,
    setSelectedRoute,
    gpxCoordinates,
    custom,
    setCustom,
    customDistanceRef,
    isAddingRoute,
    setIsAddingRoute
}: AddSpotMap) {
    const { center, trackUser } = useCenter();
    const [routeCoordinates, setRouteCoordinates] = useState<RouteCoordinates>({ start: null, end: null });
    const [loading, setLoading] = useState(false);
    const isDesktop = useMediaQuery({ minWidth: 1024 });

    useEffect(() => {
        const controller = new AbortController();
        const getRoute = async () => {
            if (routeCoordinates.start && routeCoordinates.end) {
                setLoading(true)
                const data = await fetchRoute(routeCoordinates, controller.signal);
                if (data) {
                    const converted = data.map((route: OsrmRoute) => ({
                        coordinates: osrmToJsonCoords(route.geometry.coordinates),
                        distance: route.distance,
                    }));
                    setRoutes(converted);
                }
                setLoading(false);
            }
        };
        getRoute();
        return () => controller.abort();
    }, [routeCoordinates]);

    useEffect(() => {
        if (locationType === "route" && !custom && routes.length > 0) {
            setSpotCoordinates(routes[selectedRoute].coordinates)
        }
    }, [selectedRoute, routes, locationType, custom]);

    if (!center) return;

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
            if (!isAddingRoute) setIsAddingRoute(true);
        }
    };

    const handleUndoPoint = () => {
        if (custom && spotCoordinates.length > 1) {
            const distance = estimateDistanceFromCoords([
                spotCoordinates[spotCoordinates.length - 2],
                spotCoordinates[spotCoordinates.length - 1]
            ]);
            customDistanceRef.current -= distance;
            setSpotCoordinates(prev => prev.slice(0, -1));
            setIsAddingRoute(true)
        } else if (routeCoordinates.end)
            setRouteCoordinates({ ...routeCoordinates, end: null })
        setRoutes([]);
    };

    const otherControls = (
        <>
            {locationType === "route" &&
                <div className="flex flex-col-reverse gap-0.5">
                    {custom
                        ? <Button
                            style="tertiary"
                            className="route-mode suggestion"
                            aria-label="Use route suggestion"
                            onClick={handleCustom}>
                            <img src={UseRouteButton} className="w-11 md:w-12 h-auto pointer-events-none shrink-0" />
                        </Button>
                        : <Button
                            style="tertiary"
                            className="route-mode custom"
                            aria-label="Build custom route"
                            onClick={handleCustom}>
                            <img src={CreateCustomButton} className="w-11 md:w-12 h-auto pointer-events-none shrink-0" />
                        </Button>
                    }
                    {(routeCoordinates.start || spotCoordinates.length > 0) &&
                        <div className="sticky flex gap-[5px] ml-[5px]">
                            <Button
                                style="icon"
                                className="route-controls"
                                onClick={resetRoute}
                                aria-label="Reset">
                                <MapPinX aria-hidden />
                            </Button>
                            {spotCoordinates.length > 0 &&
                                <>
                                    <Button
                                        style="icon"
                                        className="route-controls"
                                        onClick={handleUndoPoint}
                                        aria-label="Undo last point">
                                        <Undo2 aria-hidden />
                                    </Button>
                                    {!isDesktop &&
                                        <Button
                                            style="tertiary"
                                            className="route-controls"
                                            onClick={() => setIsAddingRoute(false)}
                                            aria-label="Confirm itinerary">
                                            <CheckCircle aria-hidden strokeWidth={2} />
                                            Done
                                        </Button>
                                    }
                                </>
                            }
                        </div>
                    }
                    {loading &&
                        <div className="absolute w-full top-0.5"><Loading /></div>}
                </div>
            }
        </>
    )

    return (
        <Map
            center={center}
            zoom={14}
            trackUser={trackUser}
            other={otherControls}
        >
            <FlyToUser center={center} />
            {locationType === "point" && <FlyToCoords coords={spotCoordinates} />}
            {confirmedLocationType && !gpxCoordinates &&
                <>
                    {locationType === "point" &&
                        <CoordinatePicker onPick={(lat, lon) => setSpotCoordinates([{ lat, lon }])} />}
                    {locationType === "route" &&
                        <CoordinatePicker onPick={handleRoutePick} routeCoords={routeCoordinates} />}
                </>
            }
            <UserMarker />
            {spotCoordinates.length === 1 && routes.length === 0 && !gpxCoordinates &&
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
                    custom
                />
            }
            {gpxCoordinates &&
                <RouteDisplay
                    data={gpxCoordinates}
                    selected
                />
            }
        </Map>
    )
}