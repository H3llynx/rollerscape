import { useEffect, useState } from "react";
import { fetchSpots, getCreatedByName } from "../../../services/spots";
import type { SpotFullInfo } from "../../../types/spots_types";

export function useSpots() {
    const [loading, setLoading] = useState<boolean>(true);
    const [spots, setSpots] = useState<SpotFullInfo[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadSpots = async () => {
            const { data, error } = await fetchSpots();
            if (error) setError(error.message);
            if (data) {
                const spotList = await Promise.all(
                    data.map(async spot => {
                        if (spot.created_by) {
                            return {
                                ...spot,
                                created_by_name: await getCreatedByName(spot.created_by),
                            };
                        }
                        return spot;
                    })
                );
                setSpots(spotList);
                setLoading(false);
            }
        };
        loadSpots();
    }, []);

    return { spots, loading, error };
}