import { useEffect, useState } from "react";
import { databases } from "../../../config";
import { fetchData } from "../../../services/data";
import type { Spot } from "../../../types/spots_types";

export function useSpots() {
    const [loading, setLoading] = useState<boolean>(true);
    const [spots, setSpots] = useState<Spot[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadSpots = async () => {
            const { data, error } = await fetchData(databases.spots);
            if (error) setError(error.message);
            setSpots(data);
            setLoading(false);
        };
        loadSpots();
    }, []);

    return { spots, loading, error };
}