import { Edit, Star, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import Skater from "../../../../assets/skater.png";
import { Button } from "../../../../components/Button/Button";
import { getUserInfo } from "../../../../services/spots";
import type { Review } from "../../../../types/spots_types";
import type { UserProfile } from "../../../../types/user_types";
import { getSkatingStyles, getSkillLevel } from "../../../../utils/helpers";
import { useAuth } from "../../../auth/hooks/useAuth";
import { showAvatar } from "../../../profile/utils";

type CommentCard = {
    review: Review;
    onEdit: () => void;
}

export function ReviewCard({ review, onEdit }: CommentCard) {
    const [user, setUser] = useState<UserProfile | null>(null)
    const { profile } = useAuth();
    useEffect(() => {
        const getUser = async () => {
            const { data } = await getUserInfo(review.user_id);
            setUser(data);
        }
        getUser();
    }, []);

    return (
        <div className="card text-grey flex-col items-start relative bg-bg-rgba-2">
            <div className="flex justify-between w-full">
                <div className="flex items-center gap-0.5 text-border">
                    <div className="image-container">
                        <img src={user ? showAvatar(user) : Skater}
                            className="profile-avatar"
                            alt={`${user?.name}'s profile picture`} />
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-[5px] mb-[5px]">
                            <h3>{user?.name} </h3>
                            {user?.skill_level &&
                                <span className="text-[0.65rem]">({getSkillLevel(user.skill_level)})</span>
                            }
                        </div>
                        <ul className="mx-0 text-[0.65rem]">
                            {user?.skating_style &&
                                <>
                                    {user.skating_style.map((style, i) => (
                                        <li key={i}>
                                            <Zap aria-hidden width={12} height={12} fill="var(--color-border)" className="inline mr-[5px]" />
                                            {getSkatingStyles(style)}
                                        </li>
                                    ))}
                                </>
                            }
                        </ul>
                    </div>
                </div>
                <div className="flex gap-0.5">
                    <span aria-label={`${review.rating}`} className="shrink-0">
                        {Array.from({ length: review.rating! }, (_, i) => (
                            <Star
                                key={i}
                                fill="var(--color-grey)"
                                width={15}
                                className="inline mr-[3px] cursor-auto"
                                aria-hidden />
                        ))}
                    </span>
                    {profile?.id === review.user_id &&
                        <Button style="icon" aria-label="Edit score and review" className="text-grey self-start p-0">
                            <Edit aria-hidden width={18} onClick={onEdit} />
                        </Button>
                    }
                </div>
            </div>
            {review.comment && <p className="font-light self-end ml-1">{review.comment}</p>}
        </div>
    )
}