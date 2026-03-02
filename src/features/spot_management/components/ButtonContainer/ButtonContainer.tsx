import { Edit2, Flag, Locate, MapPinned, PencilOff, Share, Star, Trash2, X } from "lucide-react";
import { useState } from "react";
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
    const [itineraryStart, setItineraryStart] = useState<boolean>(false);

    if (!spot) return;

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
        <div className={`${variant === "favorite" ? "w-fit" : "max-w-1/3 md:max-w-1/2"} button-container`}>
            {(variant === "description" || variant === "favorite") &&
                <>
                    {profile && profile.favorites &&
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
                    <Button style="icon" aria-label="Share spot" onClick={() => shareSpot(spot)}>
                        <Share aria-hidden />
                    </Button>

                    {profile && (profile.id === spot.created_by) &&
                        <>
                            <Button style="icon" aria-label="edit spot" onClick={onEdit}>
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
            {variant === "description" &&
                <>
                    {spot.location_type === "point" &&
                        <Button style="icon" aria-label="Send to GPS app" onClick={() => sendToGps(spot.name, spot.coordinates[0])}>
                            <MapPinned aria-hidden />
                        </Button>
                    }
                    {spot.location_type === "route" &&
                        <div className="flex gap-0.5 items-center">
                            <Button style="icon" className={`${itineraryStart && "gps-btn"}`} aria-label="Send to GPS app" onClick={() => setItineraryStart(!itineraryStart)}>
                                {itineraryStart
                                    ? <X aria-hidden />
                                    : <MapPinned aria-hidden />
                                }
                            </Button>
                            {itineraryStart &&
                                <div className="pick-itinerary-container bg-blur">
                                    <Button style="icon" aria-label="Start point" className="pick-itinerary-btn" onClick={() => {
                                        sendToGps(spot.name, spot.coordinates[0]);
                                        setItineraryStart(false);
                                    }}>
                                        <Locate aria-hidden width={18} />Start
                                    </Button>
                                    <Button style="icon" aria-label="End point" className="pick-itinerary-btn" onClick={() => {
                                        sendToGps(spot.name, spot.coordinates[spot.coordinates.length - 1]);
                                        setItineraryStart(false);
                                    }}>
                                        <Flag aria-hidden width={18} />End
                                    </Button>
                                </div>
                            }
                        </div>
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