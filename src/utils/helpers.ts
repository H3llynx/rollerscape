import type { RefObject } from "react";
import type { MapCoordinates } from "../types/geolocation_types";
import type { JsonCoordinates } from "../types/spots_types";

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

export const osrmToJsonCoords = (osrmCoords: MapCoordinates[]): JsonCoordinates =>
    osrmCoords.map(([lon, lat]) => ({ lat, lon }));