import type { PostgrestError } from "@supabase/supabase-js";
import { Star } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../components/Button/Button";
import { Loading } from "../../../../components/Loading/Loading";
import { databases } from "../../../../config/databases";
import { commentErrors } from "../../../../config/errors";
import { commentFormFields } from "../../../../config/spots";
import { insertData, updateData } from "../../../../services/data";
import type { Comment } from "../../../../types/spots_types";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useSpots } from "../../../map/hooks/useSpots";
import "./CommentForm.css";

type CommentForm = {
    commentToEdit: Comment | null;
    onSuccess: () => void;
}

export function CommentForm({ commentToEdit, onSuccess }: CommentForm) {
    const { selectedSpot, loadSpots } = useSpots();
    const { profile } = useAuth();
    const { score, comment } = commentFormFields;
    const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm();
    const selectedScore = watch(score.db_key) as number;
    const [commentError, setCommentError] = useState<PostgrestError | null>(null);

    if (!selectedSpot || !profile) return;

    const rateSpot = async (newScore: Record<string, unknown>) => {
        if (commentError) setCommentError(null);
        const rating = {
            comment: newScore[comment.db_key],
            rating: newScore[score.db_key],
            spot_id: selectedSpot.id,
            user_id: profile.id,
        }
        const { error } = commentToEdit
            ? await updateData({ id: commentToEdit.id, ...rating }, databases.comments)
            : await insertData(databases.comments, rating);
        if (error) if (error) {
            setCommentError(error);
            return;
        }
        onSuccess();
    }

    return (
        <div className="comment-form-container">
            <form onSubmit={handleSubmit(rateSpot)}>
                <label htmlFor={score.id}>
                    <span>{score.label}</span>
                    <input
                        id={score.id}
                        type={score.input_type}
                        defaultValue={commentToEdit && commentToEdit.rating ? commentToEdit.rating : undefined}
                        {...register(score.db_key, { valueAsNumber: true })}
                        min={score.min}
                        max={score.max}
                        className="sr-only"
                        required
                    />
                    <div className="score-container" aria-hidden>
                        {[1, 2, 3, 4, 5].map((star) => {
                            const isActive = star <= selectedScore;
                            return (
                                <Button
                                    key={star}
                                    style="icon"
                                    type="button"
                                    onClick={() => setValue(score.db_key, star, { shouldValidate: true })}
                                >
                                    {isActive ?
                                        <Star fill="var(--color-text)" />
                                        : <Star />
                                    }
                                </Button>
                            )
                        })}
                    </div>
                </label>
                <fieldset>
                    <div className="legend-container">
                        <legend className="md:font-special">
                            {comment.label}
                        </legend>
                        <span className="font-main">(optional)</span>
                    </div>
                    <textarea
                        id={comment.id}
                        className="slight-shadow bg-blur"
                        defaultValue={commentToEdit && commentToEdit.comment ? commentToEdit.comment : ""}
                        {...register(comment.db_key)}
                    />
                </fieldset>
                <div className="flex gap-0.5 self-end">
                    <Button style="tertiary" type="button" className="text-text" onClick={onSuccess}>Cancel</Button>
                    {isSubmitting ? <Loading /> :
                        <Button style="secondary" className="border-text text-text">
                            {commentToEdit ? "Update score" : "Rate this spot"}</Button>
                    }
                </div>
            </form>
            {commentError &&
                <p className="error">
                    {commentError.code === "23505" ? commentErrors[23505] : commentErrors.generic}
                </p>
            }
        </div>
    )
}