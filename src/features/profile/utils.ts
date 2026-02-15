import { countries } from "./config/geolocation";
import type { NominatimResult } from "./types";

export const formatLocation = (location: NominatimResult) => {
    const city = `${location.address.city || location.address.town || location.address.village || location.address.municipality}`;
    return `${(location.name && location.name !== city) ? location.name + "," : ""}
    ${location.address.postcode}, ${city}`;
}

export const showFlag = (code: string) => {
    return countries.filter(country => country.value === code).map(country => country.label.split(" ").splice(0, 1));
}