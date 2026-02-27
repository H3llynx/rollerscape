import { Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../components/Button/Button";
import { commentFormFields } from "../../../../config/spots";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useSpots } from "../../../map/hooks/useSpots";

export function CommentForm() {
    const { selectedSpot } = useSpots();
    const { profile } = useAuth();
    if (!selectedSpot || !profile) return;
    const { score, comment } = commentFormFields;
    const { register, handleSubmit, setValue, watch, formState: { isSubmitting, errors } } = useForm();
    const selectedScore = watch(score.db_key) as number;

    return (
        <form>
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
                <fieldset>
                    <div className="legend-container mt-1">
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
            </label>
        </form>
    )
}