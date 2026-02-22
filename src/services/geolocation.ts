import { formatLocation } from "../features/profile/utils";
import type { Coordinates, Location, NominatimResult, OsrmRoute, RouteCoordinates } from "../types/geolocation_types";

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
            `https://nominatim.openstreetmap.org/reverse?` +
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

export const getCoordinates = async (location: string): Promise<{
    data: Coordinates | null;
    error: Error | null;
}> => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?` +
            `q=${encodeURIComponent(location)}` +
            `&format=json&limit=1`,
        )
        const results = await response.json();

        if (results.length > 0) {
            return {
                data: {
                    lat: Number(results[0].lat),
                    lon: Number(results[0].lon)
                },
                error: null
            };
        } else {
            return {
                data: null,
                error: new Error("No coordinates found.")
            }
        }

    } catch (error) {
        console.error("Geocoding error:", error);
        return {
            data: null,
            error: new Error("Coordinates could not be found.")
        }
    }
}

export const fetchRoute = async (routeCoords: RouteCoordinates): Promise<OsrmRoute[] | null> => {
    const { start, end, middle } = routeCoords;
    if (!start || !end) return null;
    try {
        const url = routeCoords.middle && middle
            ? `https://router.project-osrm.org/route/v1/cycling/${start.lon},${start.lat};${middle.lon},${middle.lat};${end.lon},${end.lat}?alternatives=true&geometries=geojson&overview=full`
            : `https://router.project-osrm.org/route/v1/cycling/${start.lon},${start.lat};${end.lon},${end.lat}?alternatives=true&geometries=geojson&overview=full`
        const response = await fetch(url);
        const data = await response.json();
        return data.routes;
    } catch (error) {
        console.error(error);
        return null;
    }
}