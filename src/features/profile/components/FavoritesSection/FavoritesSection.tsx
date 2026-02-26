import { useAuth } from "../../../auth/hooks/useAuth";
import { useSpots } from "../../../map/hooks/useSpots";
import { FavoriteSpotCard } from "../FavoriteSpotCard/FavoriteSpotCard";

export function FavoritesSection() {
    const { profile } = useAuth();
    const { spots } = useSpots();
    if (!profile) return
    return (
        <div>
            <h2>Your favorite spots</h2>
            {profile.favorites.length > 0 ?
                <div className="flex gap-1 flex-col mt-1">
                    {profile.favorites.map(favorite => {
                        if (!spots) return;
                        const spot = spots.find(spot => spot.id === favorite)
                        if (!spot) return;
                        return (
                            <FavoriteSpotCard key={favorite} spot={spot} />
                        )
                    })}
                </div>
                : <p className="text-grey text-sm">You have not saved any spot yet.</p>
            }
        </div>
    )
}