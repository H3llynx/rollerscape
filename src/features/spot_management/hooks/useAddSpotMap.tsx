import { useState } from "react";
import { spotFormFields } from "../../../config/spots";
import type { Coordinates, Route, RouteCoordinates } from "../../../types/geolocation_types";
import type { RouteGenMode, Spot } from "../../../types/spots_types";
import { estimateDistanceFromCoords } from "../utils";

export const useAddSpotMap = () => {
    const { location_type } = spotFormFields;
    const [confirmedLocationType, setConfirmedLocationType] = useState<boolean>(false);
    const [locationType, setLocationType] = useState<Spot["location_type"]>(location_type.options[0] as Spot["location_type"]);
    const [spotCoordinates, setSpotCoordinates] = useState<Coordinates[]>([]);
    const [routeGenMode, setRouteGenMode] = useState<RouteGenMode | null>(null);
    const [routeCoordinates, setRouteCoordinates] = useState<RouteCoordinates>({ start: null, end: null });
    const [routes, setRoutes] = useState<Route[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<number>(0);
    const [gpxCoordinates, setGpxCoordinates] = useState<Coordinates[] | null>(null);
    const [custom, setCustom] = useState<boolean>(false);

    const resetRoute = () => {
        setSpotCoordinates([]);
        setRouteCoordinates({ start: null, end: null });
        setRoutes([]);
        setGpxCoordinates(null);
    }

    const getRouteLength = () => {
        if (locationType !== "route") return;
        return estimateDistanceFromCoords(spotCoordinates);
    };

    return {
        confirmedLocationType,
        setConfirmedLocationType,
        locationType,
        setLocationType,
        spotCoordinates,
        setSpotCoordinates,
        routeGenMode,
        setRouteGenMode,
        routeCoordinates,
        setRouteCoordinates,
        routes,
        setRoutes,
        selectedRoute,
        setSelectedRoute,
        gpxCoordinates,
        setGpxCoordinates,
        custom,
        setCustom,
        resetRoute,
        getRouteLength
    };
}