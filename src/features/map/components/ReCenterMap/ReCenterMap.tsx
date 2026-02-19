import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function ReCenterMap({ lat, lon }: { lat: number; lon: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lon], map.getZoom());
    }, [lat, lon, map]);

    return null;
}