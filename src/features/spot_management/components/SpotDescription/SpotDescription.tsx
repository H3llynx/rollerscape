import { Check, Info, MapPin, PencilLine, PencilOffIcon, Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Button } from "../../../../components/Button/Button";
import { TRAFFIC_LEVELS } from "../../../../config/spots";
import { getReviews } from "../../../../services/spots";
import type { Review } from "../../../../types/spots_types";
import { getSpotType } from "../../../../utils/helpers";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useSpots } from "../../../map/hooks/useContexts";
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
    const reviewsRef = useRef<HTMLDivElement>(null);
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
        if (isRating)
            reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [isRating]);

    if (!selectedSpot) return;

    const hideReviewForm = () => {
        setIsRating(false);
        setReviewToEdit(null);
    }

    const handleReview = async () => {
        hideReviewForm();
        await loadSpots();
        setTimeout(() => {
            reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 1000);
    }

    const handleEditReview = (review: Review) => {
        setIsRating(true);
        setReviewToEdit(review);
    }

    const reviewsPerPage = 6;
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    const paginatedReviews = reviews
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .slice(
            (currentPage - 1) * reviewsPerPage,
            currentPage * reviewsPerPage
        );

    return (
        <section id={`spot-description-${selectedSpot.id}`}>
            <DesktopSpotHeader />
            <article className="pb-2 text-sm relative z-1">
                <div className="px-1 md:p-2 flex justify-between w-full items-start">
                    <div className="md:w-2xs">
                        <h1>{selectedSpot.name}</h1>
                        <div className="flex gap-0.5 mt-1 items-start flex-wrap">
                            {selectedSpot.spot_types.map((type, i) => (
                                <span className="tag" key={i} >
                                    {getSpotType(type.name)}
                                </span>
                            )
                            )}
                        </div>
                        <div className="text-grey mt-1">
                            <MapPin aria-hidden width={15} className="inline" /><span className="align-middle">{selectedSpot.address}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-0.5 items-end">
                        <Button style="icon" aria-label="Close description" className="text-grey py-0 md:absolute top-0 right-0" onClick={() => setSelectedSpot(null)}>
                            <X aria-hidden />
                        </Button>
                        <ButtonContainer spot={selectedSpot} onEdit={onEdit} onDelete={onDelete} />
                    </div>
                </div>
                <div className="px-1 md:px-2">
                    {selectedSpot.creator_profile && !isTabletorDesktop &&
                        <div className="w-fit">
                            <RiderCard desktop={false} />
                        </div>
                    }
                    <div className="w-full flex gap-1 justify-between items-center flex-wrap mb-1 mt-2 md:mt-1">
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
                            <div className="info-icon" tabIndex={0}>
                                <Info width={15} aria-hidden />
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
                {profile && isRating &&
                    <div ref={reviewsRef}>
                        <ReviewForm onSuccess={handleReview} onCancel={hideReviewForm} reviewToEdit={reviewToEdit} />
                    </div>
                }
                {reviews.length > 0 &&
                    <>
                        <div className="px-1 md:px-2 mt-2 flex flex-col gap-1">
                            <h2 className="text-xl">Community Ratings</h2>
                            {paginatedReviews.map(review => (
                                <ReviewCard key={review.id} review={review} onClick={() => handleEditReview(review)} spotDescription />
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
            </article >
        </section >
    )
}