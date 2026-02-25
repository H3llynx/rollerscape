import { LOCATION_TYPE, ROUTE_GEN_MODE, SPOT_TYPES, TRAFFIC_LEVELS } from "../config/spots";
import type { Table } from "../services/data";
import type { Coordinates } from "./geolocation_types";

export type Spot = {
    address: string | null;
    average_rating: number | null;
    city: string;
    coordinates: Coordinates[];
    country: string;
    created_by: string | null;
    description: string | null;
    display_lat: number;
    display_lon: number;
    has_obstacles: boolean | null;
    id: string;
    length_km: number | null;
    location_type: typeof LOCATION_TYPE[number];
    name: string;
    photos: string[] | null;
    surface_quality: number | null;
    slug: string;
};

export type SpotTypeArr = {
    id: number;
    name: SpotType;
}[]

export type SpotFullInfo = Spot & {
    spot_spot_types: SpotTypeArr;
    spot_traffic_levels: { id: string; name: TrafficLevel }[];
    created_by_name: string;
}

export type TrafficLevel = typeof TRAFFIC_LEVELS[number]["value"];

export type SpotType = typeof SPOT_TYPES[number]["value"];

export type JunctionInsert = {
    table: Table;
    fKey: string;
    values: number[];
}

export type RouteGenMode = typeof ROUTE_GEN_MODE[number]["value"];