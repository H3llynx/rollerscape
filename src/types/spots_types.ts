import { SPOT_TYPES } from "../features/map/config/spots";

export type SpotType = typeof SPOT_TYPES[number]["value"];

export type Spot = {
    id: string;
    name: string;
    description: string | null;
    city: string;
    address: string | null;
    country: string;
    location_type: "point" | "route";
    coordinates: JSON;
    spot_types: SpotType[];
    surface_quality: number | null;
    has_obstacles: boolean | null;
    length_km: number | null;
    average_rating: number | null;
    total_ratings: number | null;
    traffic_level: string | null;
    photos: string[] | null;
    display_lat: number;
    display_lon: number;
    created_at: string | null;
    created_by: string | null;
    updated_at: string | null;
};

