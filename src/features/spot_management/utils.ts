import { useMapEvents } from "react-leaflet";
import type { Coordinates, MapCoordinates } from "../../types/geolocation_types";

export const CoordinatePicker = ({ onPick, onMouseMove }: {
    onPick: (lat: number, lon: number) => void;
    onMouseMove?: (lat: number, lon: number) => void;
}) => {
    useMapEvents({
        click: (e) => {
            onPick(e.latlng.lat, e.latlng.lng);
        },
        mousemove: (e) => {
            onMouseMove?.(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

export const parseGpx = (xml: string) => {
    const parser = new DOMParser();
    const gpx = parser.parseFromString(xml, 'text/xml');
    const coordinates: Coordinates[] = [];
    for (const tag of ["trkpt", "rtept"]) {
        const nodes = gpx.querySelectorAll(tag);
        if (nodes.length) {
            nodes.forEach(node => {
                coordinates.push({
                    lat: parseFloat(node.getAttribute("lat") ?? ""),
                    lon: parseFloat(node.getAttribute("lon") ?? "")
                });
            });
            break;
        }
    }
    return coordinates;
}

export const estimateDistanceFromCoords = (coords: Coordinates[]) => {
    let total = 0;
    for (let i = 0; i < coords.length - 1; i++) {
        const R = 6371;
        const dLat = (coords[i + 1].lat - coords[i].lat) * Math.PI / 180;
        const dLon = (coords[i + 1].lon - coords[i].lon) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(coords[i].lat * Math.PI / 180) *
            Math.cos(coords[i + 1].lat * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        total += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    return Math.round(total * 10) / 10;
}

export const calculateHaversineDistance = (a: Coordinates, b: Coordinates): number => {
    const R = 6371000;
    const dLat = (b.lat - a.lat) * Math.PI / 180;
    const dLon = (b.lon - a.lon) * Math.PI / 180;
    const lat1 = a.lat * Math.PI / 180;
    const lat2 = b.lat * Math.PI / 180;
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};

export const osrmToJsonCoords = (osrmCoords: MapCoordinates[]): Coordinates[] =>
    osrmCoords.map(([lon, lat]) => ({ lat, lon }));