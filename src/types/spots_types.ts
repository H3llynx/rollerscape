import { LOCATION_TYPE, TRAFFIC_LEVEL } from "../config/spots";

export type Spot = {
    address: string | null;
    average_rating: number | null;
    city: string;
    coordinates: JsonCoordinates;
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

export type SpotTypeList = {
    id: number;
    name: SpotType;
}[]

export type SpotWithTypes = Spot & {
    spot_spot_types: SpotTypeList;
}

export type TrafficLevel = typeof TRAFFIC_LEVEL[number]["value"];

export type JsonCoordinates =
    { lat: number; lon: number }[];


export type SpotType = "skatepark" | "bowl" | "bike_path" | "greenway" | "smooth_flat" | "street";

export type Route = {
    coordinates: JsonCoordinates;
    distance: number;
}