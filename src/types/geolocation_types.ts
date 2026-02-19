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
        country?: string;
        country_code?: string;
        postcode: string;
    };
};

export type MapCoordinates = [number, number]; // order: [lat, lon]