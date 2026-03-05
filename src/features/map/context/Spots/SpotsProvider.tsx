import { useEffect, useState, type ReactNode } from "react";
import { views } from "../../../../config/databases";
import { fetchData } from "../../../../services/data";
import type { SpotFullInfo } from "../../../../types/spots_types";
import { SpotsContext } from "./SpotsContext";

export function SpotsProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState<boolean>(true);
    const [spots, setSpots] = useState<SpotFullInfo[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedSpot, setSelectedSpot] = useState<SpotFullInfo | null>(null);

    const loadSpots = async () => {
        setLoading(true);
        const { data, error } = await fetchData<SpotFullInfo>(views.public_spots, "*")
        if (error) setError(error.message);
        if (data) {
            setSpots(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadSpots();
    }, []);

    const value = {
        spots, setSpots, loading, error, loadSpots,
        selectedSpot, setSelectedSpot
    };

    return (
        <SpotsContext value={value}>
            {children}
        </SpotsContext>
    )
}