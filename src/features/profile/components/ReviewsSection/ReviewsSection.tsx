import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../../../components/Button/Button";
import { views } from "../../../../config/databases";
import { redirecttoSpotUrl } from "../../../../config/urls";
import { fetchDataById } from "../../../../services/data";
import type { Review } from "../../../../types/spots_types";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useSpots } from "../../../map/hooks/useSpots";
import { ReviewCard } from "../../../spot_management/components/ReviewCard/ReviewCard";
import { SectionTemplate } from "../SectionTemplate/SectionTemplate";

export function ReviewsSection() {
    const { profile } = useAuth();
    const { spots } = useSpots();
    const reviewsPerPage = 3;
    const [currentPage, setCurrentPage] = useState(1);
    const [reviews, setReviews] = useState<Review[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getReviews = async () => {
            if (!profile) return
            const { data } = await fetchDataById<Review[]>(views.public_reviews, "*", "user_id", profile.id);
            if (data) setReviews(data);
        }
        getReviews();
    }, [profile, spots])

    if (!reviews || !reviews.length) return (
        <div>
            <h2>Your reviews</h2>
            <p className="text-grey text-sm">You have not scored any spot yet.</p>
        </div>
    )

    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    const paginatedReviews = reviews.slice(
        (currentPage - 1) * reviewsPerPage,
        currentPage * reviewsPerPage
    );

    return (
        <SectionTemplate title="Your reviews">
            <div className="flex gap-1 flex-col mt-1">
                {paginatedReviews.map(review => {
                    if (!spots) return;
                    const spot = spots.find(spot => spot.id === review.spot_id)
                    if (!spot) return;
                    return (
                        <ReviewCard key={review.id} review={review} onClick={() => navigate(redirecttoSpotUrl(spot.slug))} description={false} />
                    )
                })}
            </div>
            {totalPages > 1 &&
                <div className="flex gap-0.5 items-center text-sm">
                    <Button style="tertiary" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Prev</Button>
                    <span>{currentPage} / {totalPages}</span>
                    <Button style="tertiary" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Next</Button>
                </div>
            }
        </SectionTemplate>
    )
}