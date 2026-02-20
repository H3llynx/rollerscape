import type { SpotWithTypes } from "../../../types/spots_types";
import supabase from "../../../utils/supabase";

export const fetchSpots = async () => {
    try {
        const { data, error } = await supabase
            .from("spots")
            .select(`
                *,
                spot_spot_types(
                    spot_types(id, name)
                )
            `);
        return { data, error };
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`spots fetch error: ${error}`);
        return { data: null, error };
    }
};

export const fetchBySlug = async (slug: string) => {
    try {
        const { data, error } = await supabase
            .from("spots")
            .select(`
                *,
                spot_spot_types(
                    spot_types(id, name)
                )
            `)
            .eq("slug", slug)
            .single();
        return { data, error };
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`spot with slug ${slug} could not be loaded: ${error}`);
        return { data: null, error };
    }
}

export const shareSpot = async (spot: SpotWithTypes) => {
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

export const sendToGps = (spot: SpotWithTypes) => {
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