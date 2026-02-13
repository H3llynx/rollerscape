import type { BrowserLocation, Location, NominatimResult } from "./types";

export const searchLocations = async (query: string, country: string): Promise<Location[]> => {
    if (query.length < 3) return [];
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?` +
            `q=${encodeURIComponent(query)}&` +
            `format=json&` +
            `addressdetails=1&` +
            `limit=5&` +
            `countrycodes=${country.toLowerCase()}`
        );
        const data: NominatimResult[] = await response.json();
        return data.map((location) => ({
            name: location.display_name,
            lat: Number(location.lat),
            lon: Number(location.lon),
        }))
    } catch (error) {
        console.error(`Error fetching location suggestions: ${error}`)
        return [];
    }
};

export const getCurrentPosition = (): Promise<BrowserLocation> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation not supported"));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
            },
            (error) => {
                reject(error);
            }
        );
    });
};

export const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?` +
            `lat=${lat}&` +
            `lon=${lon}&` +
            `format=json`
        );
        const data = await response.json();
        return data.display_name || `${lat}, ${lon}`;
    } catch (error) {
        console.error(`Error with reverse geocoding: ${error}`);
        return "Reverse geocoding failed";
    }
};