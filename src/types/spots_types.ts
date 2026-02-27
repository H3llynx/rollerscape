import { LOCATION_TYPE, ROUTE_GEN_MODE, SPOT_TYPES, TRAFFIC_LEVELS } from "../config/spots";
import type { SkatingStyle } from "../config/user_info";
import type { Data } from "../services/data";
import type { Coordinates } from "./geolocation_types";

export type Spot = {
    address: string | null;
    city: string;
    coordinates: Coordinates[];
    country: string;
    created_by: string | null;
    description: string | null;
    display_lat: number;
    display_lon: number;
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

export type CreatedBy = {
    id: string;
    name: string;
    avatar_url: string;
    skating_style: SkatingStyle[];
}

export type SpotFullInfo = Spot & {
    spot_types: SpotTypeArr;
    traffic_levels: { id: string; name: TrafficLevel }[];
    created_by_name: string;
    creator_profile: CreatedBy;
    average_rating: number | null;
}

export type TrafficLevel = typeof TRAFFIC_LEVELS[number]["value"];

export type SpotType = typeof SPOT_TYPES[number]["value"];

export type JunctionInsert = {
    table: Data;
    fKey: string;
    values: number[];
}

export type RouteGenMode = typeof ROUTE_GEN_MODE[number]["value"];

export type Comments = {
    comment: string | null;
    created_at: string;
    id: string;
    rating: number | null;
    spot_id: string;
    user_id: string;
}