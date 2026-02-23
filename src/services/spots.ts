import { databases } from "../config/databases";
import type { SpotFullInfo, SpotType, TrafficLevel } from "../types/spots_types";
import supabase from "../utils/supabase";

export const fetchSpots = async () => {
    const { data, error } = await supabase
        .from("spots")
        .select(`
                *,
                spot_spot_types(
                    ...spot_types(id, name)
                ),
                spot_traffic_levels(
                    ...traffic_levels(id, name)
                )
            `)
    return { data, error };
};

export const fetchBySlug = async (slug: string) => {
    const { data, error } = await supabase
        .from("spots")
        .select(`
                *,
                spot_spot_types(
                    ...spot_types(id, name)
                )
            `)
        .eq("slug", slug)
        .single();
    return { data, error };
}

export const shareSpot = async (spot: SpotFullInfo) => {
    const url = `https://www.google.com/maps?q=${spot.display_lat},${spot.display_lon}`;
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

export const sendToGps = (spot: SpotFullInfo) => {
    if (spot.location_type === "point") {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const url = isIOS
            ? `maps://maps.apple.com/?ll=${spot.display_lat},${spot.display_lon}&q=${encodeURIComponent(spot.name)}`
            : `https://www.google.com/maps?q=${spot.display_lat},${spot.display_lon}`;

        window.open(url, '_blank');
    }
    else if (spot.location_type === "route") {
        const waypoints = spot.coordinates.map(point => ({ lat: point.lat, lon: point.lon }));

        const origin = waypoints[0];
        const destination = waypoints[waypoints.length - 1];
        const middle = waypoints.slice(1, -1).map(p => `${p.lat},${p.lon}`).join('|');

        let url = `https://www.google.com/maps/dir/?api=1`
            + `&origin=${origin.lat},${origin.lon}`
            + `&destination=${destination.lat},${destination.lon}`
            + `&travelmode=walking`;

        if (middle) url += `&waypoints=${middle}`;

        window.open(url, "_blank");
    };
};

export const getSpotTypes = async (types: SpotType[]) => {
    const { data, error } = await supabase
        .from(databases.spot_types)
        .select("id")
        .in("name", types);
    return { data, error };
}

export const getTrafficLevel = async (level: TrafficLevel) => {
    const { data, error } = await supabase
        .from(databases.traffic_levels)
        .select("id")
        .eq("name", level)
        .maybeSingle();
    return { data, error };
}

export const getCreatedByName = async (id: string) => {
    const { data } = await supabase
        .from(databases.profiles)
        .select("name")
        .eq("id", id)
        .maybeSingle();
    return data ? data.name : null;
};