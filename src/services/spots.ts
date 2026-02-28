import { databases } from "../config/databases";
import { redirecttoSpotUrl } from "../config/urls";
import type { Coordinates } from "../types/geolocation_types";
import type { SpotFullInfo, SpotType, TrafficLevel } from "../types/spots_types";
import supabase from "../utils/supabase";

export const shareSpot = async (spot: SpotFullInfo) => {
    const url = `${window.location.origin}/rollerscape/#${redirecttoSpotUrl(spot.slug)}`;
    console.log(url)
    try {
        await navigator.share({
            title: `Spot roller : ${spot.name}`,
            text: "Check out this spot! 🛼",
            url: url
        });
    } catch (error) {
        if (error instanceof Error && (error.name !== "AbortError")) {
            navigator.clipboard.writeText(url);
            alert("copied to clipboard");
        }
    }
};

export const sendToGps = (name: string, startCoordinates: Coordinates) => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const url = isIOS
        ? `maps://maps.apple.com/?ll=${startCoordinates.lat},${startCoordinates.lon}&q=${encodeURIComponent(name)}`
        : `https://www.google.com/maps?q=${startCoordinates.lat},${startCoordinates.lon}`;

    window.open(url, '_blank');
};

export const getSpotTypes = async (types: SpotType[]) => {
    const { data, error } = await supabase
        .from(databases.spot_types)
        .select("id")
        .in("name", types);
    return { data, error };
}

export const getTrafficLevels = async (level: TrafficLevel[]) => {
    const { data, error } = await supabase
        .from(databases.traffic_levels)
        .select("id")
        .in("name", level);
    return { data, error };
};

export const saveAsFav = async (spotId: string, userId: string) => {
    const { data, error } = await supabase
        .from(databases.favorites)
        .insert({ spot_id: spotId, profile_id: userId })
        .select()
        .maybeSingle();
    return { data, error };
};

export const deleteFav = async (spotId: string, userId: string) => {
    const { error } = await supabase
        .from(databases.favorites)
        .delete()
        .eq("spot_id", spotId)
        .eq("profile_id", userId);
    return { error };
};