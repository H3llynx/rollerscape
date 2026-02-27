export type Coordinates = {
    lat: number;
    lon: number;
};

export type Location = Coordinates & {
    name: string;
    display_name?: string;
};

export type HomeLocation = Location & {
    country: string;
}

export type NominatimResult = {
    display_name: string;
    lat: string;
    lon: string;
    name: string;
    address: {
        city?: string;
        town?: string;
        village?: string;
        municipality?: string;
        neighbourhood?: string;
        suburb?: string;
        country?: string;
        country_code?: string;
        postcode: string;
    };
};

export type MapCoordinates = [number, number]; // order: [lat, lon]

export type RouteCoordinates = {
    start: { lat: number; lon: number } | null;
    end: { lat: number; lon: number } | null;
    middle?: { lat: number; lon: number } | null;
};

export type RouteCoordinatesType = "start" | "end" | "middle";

export type Route = {
    coordinates: Coordinates[];
    distance: number;
};

export type OsrmRoute = {
    geometry: { coordinates: [number, number][], type: string };
    distance: number;
};