import { createContext, type Dispatch, type SetStateAction } from "react";
import type { SpotFullInfo } from "../../../../types/spots_types";

type SpotsContext = {
    spots: SpotFullInfo[] | null;
    loading: boolean;
    error: string | null;
    loadSpots: () => void;
    selectedSpot: SpotFullInfo | null;
    setSelectedSpot: Dispatch<SetStateAction<SpotFullInfo | null>>
}

export const SpotsContext = createContext<SpotsContext | null>(null);