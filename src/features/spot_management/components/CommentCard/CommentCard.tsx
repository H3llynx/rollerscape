import { Star, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import Skater from "../../../../assets/skater.png";
import { getUserInfo } from "../../../../services/spots";
import type { Comments } from "../../../../types/spots_types";
import type { UserProfile } from "../../../../types/user_types";
import { getSkatingStyles, getSkillLevel } from "../../../../utils/helpers";

export function CommentCard({ comment }: { comment: Comments }) {
    const [user, setUser] = useState<UserProfile | null>(null)
    useEffect(() => {
        const getUser = async () => {
            const { data } = await getUserInfo(comment.user_id);
            setUser(data);
        }
        getUser();
    }, []);

    return (
        <div className="card text-grey flex-col items-start relative bg-bg-rgba-2">
            <div className="flex justify-between w-full">
                <div className="flex items-center gap-0.5">
                    <div className="image-container">
                        <img src={user?.avatar_url}
                            className="profile-avatar"
                            alt={`${user?.name}'s profile picture`}
                            onError={(e) => {
                                const img = e.currentTarget;
                                if (img.src !== Skater) {
                                    img.src = Skater;
                                }
                            }} />
                    </div>
                    <div>
                        <h3 className="inline">{user?.name} </h3>
                        {user?.skill_level &&
                            <span className="text-[0.65rem]">({getSkillLevel(user.skill_level)})</span>
                        }
                        <ul className="mx-0 text-[0.65rem]">
                            {user?.skating_style &&
                                <>
                                    {user.skating_style.map((style, i) => (
                                        <li key={i}>
                                            <Zap aria-hidden width={12} height={12} fill="var(--color-grey)" className="inline mr-[5px]" />
                                            {getSkatingStyles(style)}
                                        </li>
                                    ))}
                                </>
                            }
                        </ul>
                    </div>
                </div>
                <span aria-label={`${comment.rating}`}>
                    {Array.from({ length: comment.rating! }, (_, i) => (
                        <Star
                            key={i}
                            fill="var(--color-grey)"
                            width={15}
                            className="inline mr-[3px] cursor-auto"
                            aria-hidden />
                    ))}
                </span>
            </div>
            {comment.comment && <p className="font-light self-end ml-1">{comment.comment}</p>}

        </div>
    )
}