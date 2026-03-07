import type { PostgrestError } from "@supabase/supabase-js";
import { Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../components/Button/Button";
import { Loading } from "../../../../components/Loading/Loading";
import { databases } from "../../../../config/databases";
import { spotErrors } from "../../../../config/errors";
import { reviewFormFields } from "../../../../config/spots";
import { deleteData, insertData, updateData } from "../../../../services/data";
import type { Review } from "../../../../types/spots_types";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useSpots } from "../../../map/hooks/useContexts";
import "./ReviewForm.css";

type ReviewForm = {
    reviewToEdit: Review | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export function ReviewForm({ reviewToEdit, onSuccess, onCancel }: ReviewForm) {
    const { selectedSpot } = useSpots();
    const { profile } = useAuth();
    const { score, comment } = reviewFormFields;
    const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm();
    const selectedScore = watch(score.db_key) as number;
    const [reviewError, setReviewError] = useState<PostgrestError | null>(null);
    const [deleteError, setDeleteError] = useState<boolean>(false);

    if (!selectedSpot || !profile) return;

    const reviewSpot = async (newScore: Record<string, unknown>) => {
        if (reviewError) setReviewError(null);
        const rating = {
            comment: newScore[comment.db_key],
            rating: newScore[score.db_key],
            spot_id: selectedSpot.id,
            user_id: profile.id,
        }
        const { error } = reviewToEdit
            ? await updateData({ id: reviewToEdit.id, ...rating }, databases.reviews)
            : await insertData(databases.reviews, rating);
        if (error) if (error) {
            setReviewError(error);
            return;
        }
        onSuccess();
    }

    const deleteReview = async () => {
        if (!reviewToEdit) return;
        const { error } = await deleteData(reviewToEdit.id, databases.reviews);
        if (error) {
            setDeleteError(true);
            return;
        }
        onSuccess();
    }

    return (
        <div className="comment-form-container">
            <form onSubmit={handleSubmit(reviewSpot)} aria-label="spot review">
                <label htmlFor={score.id}>
                    <span>{score.label}</span>
                    <input
                        id={score.id}
                        type={score.input_type}
                        defaultValue={reviewToEdit && reviewToEdit.rating ? reviewToEdit.rating : undefined}
                        {...register(score.db_key, { valueAsNumber: true })}
                        min={score.min}
                        max={score.max}
                        className="sr-only"
                        required
                    />
                    <div className="score-container" aria-hidden>
                        {[5, 4, 3, 2, 1].map((star) => {
                            const isActive = star <= selectedScore;
                            return (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setValue(score.db_key, star, { shouldValidate: true })}
                                >
                                    {isActive ?
                                        <Star fill="var(--color-text)" />
                                        : <Star />
                                    }
                                </button>
                            )
                        })}
                    </div>
                </label>
                <label htmlFor={comment.id} className="md:font-special inline">
                    {comment.label}
                    <span className="font-main text-xs"> (optional)</span>
                    <textarea
                        id={comment.id}
                        className="slight-shadow bg-blur"
                        defaultValue={reviewToEdit && reviewToEdit.comment ? reviewToEdit.comment : ""}
                        {...register(comment.db_key)}
                    />
                </label>
                <div className="flex gap-0.5 self-end">
                    <Button style="tertiary" type="button" className="text-text" onClick={onCancel}>Cancel</Button>
                    {isSubmitting ? <Loading /> :
                        <Button style="secondary" className="border-text text-text">
                            {reviewToEdit ? "Update score" : "Rate this spot"}</Button>
                    }
                    {reviewToEdit &&
                        <Button type="button" style="icon" aria-label="Delete review" onClick={deleteReview}><Trash2 aria-hidden /></Button>
                    }
                </div>
            </form>
            {reviewError &&
                <p className="error">
                    {reviewError.code === "23505" ? spotErrors.review[23505] : spotErrors.review.generic}
                </p>
            }
            {deleteError && <p className="error">{spotErrors.delete.review}</p>}
        </div>
    )
}