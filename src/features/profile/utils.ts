import type { NominatimResult } from "../../types/geolocation_types";
import { COUNTRIES } from "./config/geolocation";

export const formatLocation = (location: NominatimResult) => {
    const city = `${location.address.city || location.address.town || location.address.village || location.address.municipality}`;
    return `${(location.name && location.name !== city) ? location.name + "," : ""}
    ${location.address.postcode}, ${city}`;
}

export const showFlag = (code: string) => {
    return COUNTRIES.filter(country => country.value === code).map(country => country.label.split(" ").splice(0, 1));
}