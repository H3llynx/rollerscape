import { Edit2, Navigation, PencilOff, Share, Star, Trash2 } from "lucide-react";
import { Button } from "../../../../components/Button/Button";
import { deleteFav, saveAsFav, sendToGps, shareSpot } from "../../../../services/spots";
import type { SpotFullInfo } from "../../../../types/spots_types";
import { useAuth } from "../../../auth/hooks/useAuth";
import "./ButtonContainer.css";

type ButtonContainer = {
    spot: SpotFullInfo;
    onEdit?: () => void;
    onDelete?: () => void;
    onCancel?: () => void;
    variant?: "description" | "update" | "favorite"
}

export function ButtonContainer({ spot, onEdit, onDelete, onCancel, variant = "description" }: ButtonContainer) {
    const { profile, setProfile } = useAuth();

    const addToFav = async () => {
        if (!profile) return;
        await saveAsFav(spot.id, profile.id)
        setProfile({ ...profile, favorites: [...profile.favorites, spot.id] })
    }

    const removeFromFav = async () => {
        if (!profile) return;
        await deleteFav(spot.id, profile.id);
        setProfile({ ...profile, favorites: profile.favorites.filter(fav => fav !== spot.id) })
    }

    return (
        <div className="button-container">
            {(variant === "description" || variant === "favorite") &&
                <>
                    {profile &&
                        <>
                            {profile.favorites.includes(spot.id) ?
                                <Button style="icon" aria-label="Save as favorite" onClick={removeFromFav}>
                                    <Star aria-hidden fill="var(--color-text)" />
                                </Button>
                                : <Button style="icon" aria-label="Save as favorite" onClick={addToFav}>
                                    <Star aria-hidden />
                                </Button>
                            }
                        </>
                    }
                    <Button style="icon" aria-label="Share selected spot" onClick={() => shareSpot(spot)}>
                        <Share aria-hidden />
                    </Button>
                    <Button style="icon" aria-label="Send to GPS app" onClick={() => sendToGps(spot)}>
                        <Navigation aria-hidden />
                    </Button>
                    {profile && (profile.id === spot.created_by) &&
                        <>
                            <Button style="icon" aria-label="edit selected spot" onClick={onEdit}>
                                <Edit2 aria-hidden />
                            </Button>
                            {variant !== "favorite" &&
                                <Button style="icon" aria-label="Delete spot" onClick={onDelete}>
                                    <Trash2 aria-hidden />
                                </Button>
                            }
                        </>
                    }
                </>
            }
            {variant === "update" &&
                <>
                    <Button style="icon" aria-label="Delete spot" onClick={onDelete}>
                        <Trash2 aria-hidden />
                    </Button>
                    <Button style="icon" aria-label="Cancel edition" onClick={onCancel}>
                        <PencilOff aria-hidden />
                    </Button>
                </>
            }
        </div>
    )
}