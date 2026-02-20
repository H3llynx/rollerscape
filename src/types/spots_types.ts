
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
    location_type: "point" | "route";
    name: string;
    photos: string[] | null;
    surface_quality: number | null;
    slug: string;
};

export type SpotWithTypes = Spot & {
    spot_spot_types: {
        spot_types: {
            id: number;
            name: SpotType;
        }
    }[]
}

export type JsonCoordinates =
    { lat: number; lon: number }[];


export type SpotType = "skatepark" | "bowl" | "bike path" | "greenway" | "smooth flat" | "street";