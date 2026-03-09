import type { RefObject } from "react";
import { SPOT_TYPES } from "../config/spots";
import { SKATING_STYLES, SKILLS, } from "../config/user_info";
import type { NominatimResult } from "../types/geolocation_types";
import type { SpotType } from "../types/spots_types";
import type { SkatingStyle, SkillLevel } from "../types/user_types";

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

export const formatLocation = (location: NominatimResult) => {
    const city = `${location.address.city || location.address.town || location.address.village || location.address.municipality}`;
    const quartier = `${location.address.neighbourhood || location.address.suburb || " "}`
    return `
    ${(location.name && location.name !== city) ? location.name + "," : ""}
    ${quartier ?? quartier}
    ${location.address.postcode} ${city}
    `;
}

export const getSpotType = (type: SpotType) => SPOT_TYPES
    .filter(spot => spot.value === type)
    .map(spot => spot.label);

export const getSkillLevel = (level: SkillLevel) => SKILLS
    .filter(skill => skill.value === level)
    .map(skill => skill.label);

export const getSkatingStyles = (style: SkatingStyle) => SKATING_STYLES
    .filter(skating => skating.value === style)
    .map(skating => skating.label);

export const compressImage = (file: File, maxWidth = 1200, quality = 0.8): Promise<File> => {
    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            const canvas = document.createElement("canvas");
            const ratio = Math.min(maxWidth / img.width, 1);
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;

            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(
                (blob) => resolve(new File([blob!], file.name, { type: "image/webp" })),
                "image/webp",
                quality
            );
        };

        img.src = url;
    });
};