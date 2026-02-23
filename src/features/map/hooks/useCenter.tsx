import { useEffect, useState } from "react";
import { geolocationErrors } from "../../../config/errors";
import { getBrowserPosition } from "../../../services/geolocation";
import type { MapCoordinates } from "../../../types/geolocation_types";
import { useAuth } from "../../auth/hooks/useAuth";

export function useCenter() {
    const [center, setCenter] = useState<MapCoordinates | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { profile, loading } = useAuth();

    useEffect(() => {
        if (loading) return;
        const loadCenter = async () => {
            if (profile && (profile.home_lat && profile.home_lon))
                setCenter([profile.home_lat, profile.home_lon])
            else await trackUser();
        }
        loadCenter();
    }, [loading]);

    const trackUser = async () => {
        const { data, error } = await getBrowserPosition();
        if (error) {
            if ("code" in error)
                setError(geolocationErrors.map[error.code as keyof typeof geolocationErrors.map] || geolocationErrors.map[2]);
            else setError(geolocationErrors.map[2])
        };
        if (data) {
            setCenter([data.lat, data.lon]);
        }
    };

    return { center, setCenter, error, setError, trackUser, profile }
}