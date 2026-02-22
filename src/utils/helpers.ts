import type { RefObject } from "react";
import type { Coordinates, MapCoordinates } from "../types/geolocation_types";

export const handleAria = (checkboxRef: RefObject<HTMLInputElement | null>) => {
    if (checkboxRef.current) {
        checkboxRef.current.setAttribute("aria-expanded", checkboxRef.current.checked ? "true" : "false");
    }
}

export const capitalize = (label: string) => {
    return (label).charAt(0).toUpperCase() + (label).slice(1);
};

export const createSlug = (name: string) => {
    return name.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase();
};

export const osrmToJsonCoords = (osrmCoords: MapCoordinates[]): Coordinates[] =>
    osrmCoords.map(([lon, lat]) => ({ lat, lon }));