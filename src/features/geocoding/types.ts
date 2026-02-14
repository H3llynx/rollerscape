export type Coordinates = {
    lat: number;
    lon: number;
};

export type Location = Coordinates & {
    name: string;
};

export type HomeLocation = Location & {
    country: string;
}

export type NominatimResult = {
    display_name: string;
    lat: string;
    lon: string;
    address?: {
        city?: string;
        town?: string;
        village?: string;
        country?: string;
        country_code?: string;
    };
};
