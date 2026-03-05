import { useMemo } from "react";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useSpots } from "../../../map/hooks/useContexts";
import { SpotCard } from "../SpotCard/SpotCard";

export function SubmittedSpotsSection() {
    const { spots } = useSpots();
    const { profile } = useAuth();

    const submittedSpots = useMemo(() => {
        if (!profile || !spots) return [];
        return spots.filter(spot => spot.created_by === profile.id);
    }, [spots]);

    if (!submittedSpots.length) return;

    return (
        <div>
            <h2>Your submitted spots</h2>
            <div className="cards-grid my-1">
                {submittedSpots.map(spot => (
                    <SpotCard key={spot.id} type="submitted" spot={spot} />
                ))}
            </div>
        </div>
    )
}