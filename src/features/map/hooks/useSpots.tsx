import { useEffect, useState } from "react";
import { fetchSpots } from "../../../services/spots";
import type { SpotWithTypes } from "../../../types/spots_types";

export function useSpots() {
    const [loading, setLoading] = useState<boolean>(true);
    const [spots, setSpots] = useState<SpotWithTypes[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadSpots = async () => {
            const { data, error } = await fetchSpots();
            if (error) setError(error.message);
            setSpots(data);
            setLoading(false);
        };
        loadSpots();
    }, []);

    return { spots, loading, error };
}