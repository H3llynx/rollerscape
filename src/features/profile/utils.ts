import Skater from "../../assets/skater.png";
import { COUNTRIES } from "../../config/geolocation";
import type { NominatimResult } from "../../types/geolocation_types";
import type { UserProfile } from "../../types/user_types";

export const formatLocation = (location: NominatimResult) => {
    const city = `${location.address.city || location.address.town || location.address.village || location.address.municipality}`;
    return `${(location.name && location.name !== city) ? location.name + "," : ""}
    ${location.address.postcode}, ${city}`;
}

export const showFlag = (code: string) => {
    return COUNTRIES.filter(country => country.value === code).map(country => country.label.split(" ").splice(0, 1));
}

export const showAvatar = (profile: UserProfile) => {
    if (!profile) return;
    if (profile.avatar_url) return profile.avatar_url;
    else return Skater;
}