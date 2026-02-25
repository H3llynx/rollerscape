import { useEffect, useState, type ReactNode } from "react";
import { databases, dbSelect } from "../../../config/databases";
import { fetchData } from "../../../services/data";
import { getCreatedByName } from "../../../services/spots";
import type { SpotFullInfo } from "../../../types/spots_types";
import { SpotsContext } from "./SpotsContext";

export function SpotsProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState<boolean>(true);
    const [spots, setSpots] = useState<SpotFullInfo[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedSpot, setSelectedSpot] = useState<SpotFullInfo | null>(null);

    const loadSpots = async () => {
        const { data, error } = await fetchData<SpotFullInfo>(databases.spots, dbSelect.spots.allWithJunctions);
        if (error) setError(error.message);
        if (data) {
            const spotList = await Promise.all(
                data.map(async (spot) => {
                    if (spot && spot.created_by) {
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

    useEffect(() => {
        loadSpots();
    }, []);

    const value = {
        spots, loading, error, loadSpots,
        selectedSpot, setSelectedSpot
    };

    return (
        <SpotsContext value={value}>
            {children}
        </SpotsContext>
    )
}