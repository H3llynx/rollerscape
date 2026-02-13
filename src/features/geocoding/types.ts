export type BrowserLocation = {
    display_name?: string;
    lat: number;
    lon: number;
};

export type Location = {
    name: string;
    lat: number;
    lon: number;
};

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