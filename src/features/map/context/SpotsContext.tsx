import { createContext, type Dispatch, type SetStateAction } from "react";
import type { SpotFullInfo } from "../../../types/spots_types";

type SpotsContext = {
    spots: SpotFullInfo[] | null;
    setSpots: Dispatch<SetStateAction<SpotFullInfo[] | null>>;
    loading: boolean;
    error: string | null;
    loadSpots: () => Promise<void>;
    selectedSpot: SpotFullInfo | null;
    setSelectedSpot: Dispatch<SetStateAction<SpotFullInfo | null>>;
}

export const SpotsContext = createContext<SpotsContext | null>(null);