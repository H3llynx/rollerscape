import { useEffect, useState } from "react";
import { POSSIBLE_DUPE_THRESHOLD_METERS } from "../../../config/spots";
import type { Coordinates } from "../../../types/geolocation_types";
import type { Spot } from "../../../types/spots_types";
import { useSpots } from "../../map/hooks/useContexts";
import { calculateHaversineDistance } from "../utils";


export function useSpotDuplicateCheck(spotCoordinates: Coordinates[], locationType: Spot["location_type"]) {
    const { spots } = useSpots();
    const [possibleDupe, setPossibleDupe] = useState<Spot[] | null>(null);

    useEffect(() => {
        if (!spotCoordinates?.length || locationType !== "point") return;

        const possibleDupe = spots!
            .filter(spot => spot.location_type === "point")
            .filter(spot =>
                calculateHaversineDistance(spotCoordinates[0], spot.coordinates[0]) < POSSIBLE_DUPE_THRESHOLD_METERS
            );
        setPossibleDupe(possibleDupe.length ? possibleDupe : null);
    }, [spotCoordinates]);


    return { possibleDupe, setPossibleDupe };
}