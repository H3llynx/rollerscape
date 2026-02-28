import type { PostgrestError } from "@supabase/supabase-js";
import { Star } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../components/Button/Button";
import { Loading } from "../../../../components/Loading/Loading";
import { databases } from "../../../../config/databases";
import { commentErrors } from "../../../../config/errors";
import { commentFormFields } from "../../../../config/spots";
import { insertData } from "../../../../services/data";
import type { FormProps } from "../../../../types/other_reusable_types";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useSpots } from "../../../map/hooks/useSpots";
import "./CommentForm.css";

export function CommentForm({ onSuccess }: FormProps) {
    const { selectedSpot, loadSpots } = useSpots();
    const { profile } = useAuth();

    if (!selectedSpot || !profile) return;

    const { score, comment } = commentFormFields;
    const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm();
    const selectedScore = watch(score.db_key) as number;
    const [commentError, setCommentError] = useState<PostgrestError | null>(null);

    const addScore = async (newScore: Record<string, unknown>) => {
        if (commentError) setCommentError(null);
        const rating = {
            comment: newScore[comment.db_key],
            rating: newScore[score.db_key],
            spot_id: selectedSpot.id,
            user_id: profile.id,
        }
        const { error } = await insertData(databases.comments, rating);
        if (error) if (error) {
            setCommentError(error);
            return;
        }
        loadSpots();
        onSuccess();
    }

    return (
        <div className="comment-form-container">
            <form onSubmit={handleSubmit(addScore)}>
                <label htmlFor={score.id}>
                    <span>{score.label}</span>
                    <input
                        id={score.id}
                        type={score.input_type}
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
                        {...register(comment.db_key)}
                    />
                </fieldset>
                <div className="flex gap-0.5 self-end">
                    <Button style="tertiary" type="button" className="text-text" onClick={onSuccess}>Cancel</Button>
                    {isSubmitting ? <Loading /> :
                        <Button style="secondary" className="border-text text-text">Rate this spot</Button>
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