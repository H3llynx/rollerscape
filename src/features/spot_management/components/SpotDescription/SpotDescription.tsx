import { Check, Info, MapPin, PencilLine, PencilOffIcon, Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Button } from "../../../../components/Button/Button";
import { TRAFFIC_LEVELS } from "../../../../config/spots";
import { getReviews } from "../../../../services/spots";
import type { Review } from "../../../../types/spots_types";
import { getSpotType } from "../../../../utils/helpers";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useSpots } from "../../../map/hooks/useSpots";
import { ButtonContainer } from "../ButtonContainer/ButtonContainer";
import { DesktopSpotHeader } from "../DesktopSpotHeader/DesktopSpotHeader";
import { ReviewCard } from "../ReviewCard/ReviewCard";
import { ReviewForm } from "../ReviewForm/ReviewForm";
import { RiderCard } from "../RiderCard/RiderCard";
import { SpotPhotos } from "../SpotPhotos/SpotPhotos";
import "./SpotDescription.css";

type SpotDescription = {
    onEdit: () => void;
    onDelete: () => void;
}

export function SpotDescription({ onEdit, onDelete }: SpotDescription) {
    const isTabletorDesktop = useMediaQuery({ minWidth: 768 });
    const { selectedSpot, setSelectedSpot } = useSpots();
    const { profile } = useAuth();
    const [isRating, setIsRating] = useState<boolean>(false);
    const commentsRef = useRef<HTMLDivElement>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null);
    const { loadSpots } = useSpots();
    const [currentPage, setCurrentPage] = useState(1);

    const fetchComments = async () => {
        if (!selectedSpot) return;
        const { data } = await getReviews(selectedSpot.id)
        if (data) setReviews(data);
    };

    useEffect(() => {
        fetchComments();
    }, [selectedSpot])

    useEffect(() => {
        if (isRating && commentsRef.current) {
            commentsRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [isRating]);

    const handleCommentEdit = (review: Review) => {
        setIsRating(true);
        setReviewToEdit(review);
    }

    const handleCommentSubmit = () => {
        setIsRating(false);
        setReviewToEdit(null);
        loadSpots();
    }

    const reviewsPerPage = 6;
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    const paginatedReviews = reviews.slice(
        (currentPage - 1) * reviewsPerPage,
        currentPage * reviewsPerPage
    );

    if (!selectedSpot) return;

    return (
        <section id={`spot-description-${selectedSpot.id}`}>
            <DesktopSpotHeader />
            <article className="pb-2 md:py-1 text-sm relative z-1">
                <div className="px-1 md:px-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1>{selectedSpot.name}</h1>
                            <div className="flex gap-0.5 mt-1 items-start flex-wrap">
                                {selectedSpot.spot_types.map((type, i) => (
                                    <span className="tag" key={i} >
                                        {getSpotType(type.name)}
                                    </span>
                                )
                                )}
                            </div>
                            {selectedSpot.creator_profile && !isTabletorDesktop &&
                                <RiderCard desktop={false} />
                            }
                        </div>
                        <ButtonContainer spot={selectedSpot} onEdit={onEdit} onDelete={onDelete} />
                        <Button style="icon" className="hidden md:block absolute right-0 top-0" aria-label="Close description" onClick={() => setSelectedSpot(null)}>
                            <X aria-hidden />
                        </Button>
                    </div>
                    <div className="flex items-center gap-[5px] text-grey mt-1">
                        <MapPin aria-hidden width={15} /><span>{selectedSpot.address}</span>
                    </div>
                    <div className="w-full flex gap-1 justify-between items-center flex-wrap my-1">
                        <div className="flex items-center gap-[5px] w-full">
                            <h3 className="shrink-0">Surface quality:</h3>
                            {selectedSpot.surface_quality &&
                                <span className="shrink-0" aria-label={`${selectedSpot.surface_quality}`}>
                                    {Array.from({ length: selectedSpot.surface_quality }, (_, i) => (
                                        <Star
                                            key={i}
                                            fill="var(--color-grey)"
                                            width={15}
                                            className="inline mr-[3px] cursor-auto"
                                            aria-hidden />
                                    ))}
                                </span>
                            }
                            <div className="relative w-full">
                                <Info width={14} aria-hidden className="info-icon" tabIndex={0} />
                                <span className="surface-quality-info">Reported by the submitter</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-[5px] flex-wrap">
                            <h3>Average rating:</h3>
                            {selectedSpot.average_rating ?
                                <span aria-label={`${selectedSpot.average_rating}`}>
                                    {Array.from({ length: Math.round(selectedSpot.average_rating) }).map((_, i) => (
                                        <Star
                                            key={i}
                                            fill="var(--color-grey)"
                                            width={15}
                                            className="inline mr-[3px] cursor-auto"
                                            aria-hidden />
                                    ))}
                                </span>
                                : <span className="text-xs text-grey mr-0.5">No ratings yet</span>
                            }

                            {profile &&
                                <Button style="tertiary" className="text-xs py-0 inline" onClick={() => setIsRating(!isRating)}>
                                    {!isRating ?
                                        <>
                                            <PencilLine aria-hidden className="inline mr-[5px]" width={13} />
                                            {selectedSpot.average_rating ? "Rate this spot!" : "Be the first!"}
                                        </>
                                        :
                                        <>
                                            <PencilOffIcon aria-hidden className="inline mr-[5px]" width={13} />
                                            "Never mind"
                                        </>
                                    }
                                </Button>
                            }
                        </div>
                        {selectedSpot.length_km &&
                            <div className="flex items-center gap-[5px]">
                                <h3>Distance:</h3>{selectedSpot.length_km} km</div>
                        }
                    </div>
                    <div className={`flex gap-[5px] ${selectedSpot.traffic_levels.length > 1 ? "flex-col" : "flex-row"}`}>
                        <h3>Traffic level:</h3>
                        <ul>
                            {selectedSpot.traffic_levels.map(level =>
                                <li
                                    key={level.id}
                                    className={`${selectedSpot.traffic_levels.length > 1 && "text-xs"}`}>
                                    {selectedSpot.traffic_levels.length > 1 && <Check aria-hidden width={12} height={20} className="inline mr-[5px]" />}
                                    {TRAFFIC_LEVELS
                                        .filter(l => l.value === level.name)
                                        .map(l => l.label)}
                                </li>
                            )}
                        </ul>
                    </div>
                    {selectedSpot.description &&
                        <>
                            <h3 className="mt-1">Description:</h3>
                            {selectedSpot.description}
                        </>
                    }
                </div>
                <SpotPhotos />
                <div ref={commentsRef}>
                    {profile && isRating &&
                        <ReviewForm onSuccess={handleCommentSubmit} reviewToEdit={reviewToEdit} />
                    }
                    {reviews.length > 0 &&
                        <>
                            <div className="px-1 md:px-2 mt-3.5 flex flex-col gap-1">
                                <h2 className="text-xl">Community Ratings</h2>
                                {paginatedReviews.map(review => (
                                    <ReviewCard key={review.id} review={review} onClick={() => handleCommentEdit(review)} description />
                                ))}
                            </div>
                            {totalPages > 1 &&
                                <div className="px-1 md:px-2 flex gap-0.5 items-center text-sm">
                                    <Button style="tertiary" className="text-text" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Prev</Button>
                                    <span className="text-grey">{currentPage} / {totalPages}</span>
                                    <Button style="tertiary" className="text-text" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Next</Button>
                                </div>
                            }
                        </>
                    }
                </div>
            </article >
        </section>
    )
}