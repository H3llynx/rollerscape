import { databases, views } from "../config/databases";
import { redirecttoSpotUrl } from "../config/urls";
import type { Coordinates } from "../types/geolocation_types";
import type { SpotFullInfo } from "../types/spots_types";
import supabase from "../utils/supabase";

export const shareSpot = async (spot: SpotFullInfo) => {
    const url = `${window.location.origin}/rollerscape/#${redirecttoSpotUrl(spot.slug)}`;
    try {
        await navigator.share({
            title: `${spot.name}`,
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

export const getReviews = async (spotId: string) => {
    const { data, error } = await supabase
        .from(views.public_reviews)
        .select("*")
        .eq("spot_id", spotId);
    return { data, error };
}

export const getUserInfo = async (userId: string) => {
    const { data, error } = await supabase
        .from(views.public_rider)
        .select("*")
        .eq("id", userId)
        .maybeSingle();
    return { data, error }
}

export const addSpotTypePreference = async (profileId: string, spotTypeId: number) => {
    const { error } = await supabase
        .from("profile_spot_types")
        .insert({ profile_id: profileId, spot_type_id: spotTypeId });
    return { error };
};

export const removeSpotTypePreference = async (profileId: string, spotTypeId: number) => {
    const { error } = await supabase
        .from("profile_spot_types")
        .delete()
        .eq("profile_id", profileId)
        .eq("spot_type_id", spotTypeId);
    return { error };
};