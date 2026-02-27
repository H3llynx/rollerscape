import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Button } from "../../../../components/Button/Button";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useSpots } from "../../../map/hooks/useSpots";
import { FavoriteSpotCard } from "../FavoriteSpotCard/FavoriteSpotCard";

export function FavoritesSection() {
    const { profile } = useAuth();
    const { spots } = useSpots();
    const isDesktop = useMediaQuery({ minWidth: 1024 });
    const favPerPage = isDesktop ? 2 : 6;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (profile?.favorites)
            setCurrentPage(1);
    }, [profile?.favorites]);

    if (!profile || !spots) return

    if (!profile.favorites) return (
        <div>
            <h2>Your favorites spots</h2>
            <p className="text-grey text-sm">You have not saved any spot yet.</p>
        </div>
    )

    const totalPages = Math.ceil(profile.favorites.length / favPerPage);
    const paginatedSpots = profile.favorites.slice(
        (currentPage - 1) * favPerPage,
        currentPage * favPerPage
    );
    return (
        <div>
            <h2>Your favorites spots</h2>
            {profile.favorites.length > 0 ?
                <div className="flex gap-1 flex-col mt-1">
                    {paginatedSpots.map(favorite => {
                        const spot = spots.find(spot => spot.id === favorite)
                        if (!spot) return;
                        return (
                            <FavoriteSpotCard key={favorite} spot={spot} />
                        )
                    })}
                </div>
                : <p className="text-grey text-sm">You have not saved any spot yet.</p>
            }
            {totalPages > 1 &&
                <div className="flex gap-0.5 items-center text-sm">
                    <Button style="tertiary" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Prev</Button>
                    <span>{currentPage} / {totalPages}</span>
                    <Button style="tertiary" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Next</Button>
                </div>
            }
        </div>
    )
}