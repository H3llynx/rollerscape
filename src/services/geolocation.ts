import { urls } from "../config/urls";
import { formatLocation } from "../features/profile/utils";
import type { Coordinates, Location, NominatimResult, OsrmRoute, RouteCoordinates } from "../types/geolocation_types";
import supabase from "../utils/supabase";

export const searchLocations = async (query: string, country: string): Promise<Location[]> => {
    if (query.length < 3) return [];
    try {
        const response = await fetch(
            `${urls.nominatim}/search?` +
            `q=${encodeURIComponent(query)}&` +
            `format=json&` +
            `addressdetails=1&` +
            `limit=5&` +
            `countrycodes=${country.toLowerCase()}`
        );
        const data: NominatimResult[] = await response.json();
        return data.map((location) => ({
            display_name: location.display_name,
            name: formatLocation(location),
            lat: Number(location.lat),
            lon: Number(location.lon)
        }))
    } catch (error) {
        console.error(`Error fetching location suggestions: ${error}`)
        return [];
    }
};

export const getBrowserPosition = async (): Promise<{
    data: Coordinates | null;
    error: GeolocationPositionError | Error | null
}> => {
    if (!navigator.geolocation) {
        return {
            data: null,
            error: new Error("Geolocation not supported")
        };
    }
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    data: {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    },
                    error: null
                });
            },
            (error) => {
                resolve({
                    data: null,
                    error
                });
            }
        );
    });
};

export const reverseGeocode = async ({ lat, lon }: Coordinates) => {
    try {
        const response = await fetch(
            `${urls.nominatim}/reverse?` +
            `lat=${lat}&` +
            `lon=${lon}&` +
            `format=json`
        );
        const data = await response.json();
        return {
            name: formatLocation(data),
            city: data.address.city || data.address.town || data.address.village || data.address.municipality,
            country: data.address.country_code,
            lat: lat,
            lon: lon
        }
    } catch (error) {
        console.error(`Error with reverse geocoding: ${error}`);
        return {
            name: "unknown",
            country: "unknown",
            lat: lat,
            lon: lon
        }
    }
};

export const fetchRoute = async (routeCoords: RouteCoordinates, signal: AbortSignal): Promise<OsrmRoute[] | null> => {
    const { start, end, middle } = routeCoords;
    if (!start || !end) return null;
    try {
        const osrmUrl = routeCoords.middle && middle
            ? `${urls.osrm}/${start.lon},${start.lat};${middle.lon},${middle.lat};${end.lon},${end.lat}?alternatives=true&geometries=geojson&overview=full`
            : `${urls.osrm}/${start.lon},${start.lat};${end.lon},${end.lat}?alternatives=true&geometries=geojson&overview=full`
        const response = await fetch(osrmUrl, { signal });
        const data = await response.json();
        return data.routes;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getCoordsFromMaps = async (url: string) => {
    const { data, error } = await supabase.functions.invoke("get-coords-from-google-url", { body: { url } });
    if (error) return { data: null, error: "fetch error" };
    const coords = data.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    const lat = Number(coords[1]);
    const lon = Number(coords[2]);
    if (isNaN(lat) || isNaN(lon)) return { data: null, error: "wrong coordinates" };
    return { data: { lat, lon }, error: null };
}