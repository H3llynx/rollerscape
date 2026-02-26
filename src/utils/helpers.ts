import type { RefObject } from "react";
import { SPOT_TYPES } from "../config/spots";
import type { Coordinates, MapCoordinates } from "../types/geolocation_types";
import type { SpotType } from "../types/spots_types";

export const handleAria = (checkboxRef: RefObject<HTMLInputElement | null>) => {
    if (checkboxRef.current) {
        checkboxRef.current.setAttribute("aria-expanded", checkboxRef.current.checked ? "true" : "false");
    }
}

export const capitalize = (label: string) => {
    return (label).charAt(0).toUpperCase() + (label).slice(1);
};

export const createSlug = (name: string) => {
    return name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[()[\]{}]/g, "")
        .replace(/[^a-z0-9\s-]/gi, "")
        .replace(/\s+/g, "-")
        .replace(/-{2,}/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase();
};

export const osrmToJsonCoords = (osrmCoords: MapCoordinates[]): Coordinates[] =>
    osrmCoords.map(([lon, lat]) => ({ lat, lon }));

export const getSpotType = (type: SpotType) => SPOT_TYPES
    .filter(spot => spot.value === type)
    .map(spot => spot.label)