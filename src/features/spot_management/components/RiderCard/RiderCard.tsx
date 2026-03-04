import { Check } from "lucide-react";
import Skater from "../../../../assets/skater.png";
import { getSkatingStyles, getSkillLevel } from "../../../../utils/helpers";
import { useSpots } from "../../../map/hooks/useSpots";
import { showAvatar } from "../../../profile/utils";

export function RiderCard({ desktop = true }: { desktop?: boolean }) {
    const { selectedSpot } = useSpots();
    if (!selectedSpot) return;
    const rider = selectedSpot.creator_profile
    if (!rider) return;

    const skatingStyles = (
        <>
            {rider.skating_style.length > 1 ?
                <ul className="mx-0 mt-[5px] md:text-[0.7rem] inline md:block">
                    {rider.skating_style.map((style, i) => (
                        <li key={i} className="inline-block mr-[5px] md:block">
                            <Check className="inline mr-[3px]" width={15} height={15} />
                            {getSkatingStyles(style)}
                        </li>
                    ))}
                </ul>
                : <span className="md:text-[0.7rem]">{getSkatingStyles(rider.skating_style[0])}</span>
            }
        </>
    )

    return (
        <>
            {desktop &&
                <div className="card bg-bg-secondary bg-blur max-w-3xs">
                    <div className="flex flex-col items-center justify-center">
                        <div className="image-container">
                            <img src={showAvatar(rider)} alt="Profile avatar" className="profile-avatar" onError={(e) => {
                                const img = e.currentTarget;
                                if (img.src !== Skater) {
                                    img.src = Skater;
                                }
                            }} />
                        </div>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1 text-sm text-left">
                        <p className="font-title text-text-secondary">
                            Submitter: <span className="text-text">{rider.name}</span></p>
                        {rider.skill_level &&
                            <p className="font-title text-text-secondary">
                                Level:  <span className="text-text font-main text-[0.7rem]">{getSkillLevel(rider.skill_level)}</span></p>
                        }

                        {rider.skating_style &&
                            <div className="font-main text-sm font-light">
                                <p className="font-title text-text-secondary">Skating style:</p>
                                {skatingStyles}
                            </div>
                        }
                    </div>
                </div >
            }
            {
                !desktop &&
                <div className="mt-1 border border-border rounded-lg p-0.5 text-border">
                    <p>Submitted by <span className="text-text-secondary font-bold">
                        {rider.name} </span>
                        {rider.skill_level &&
                            <span>({getSkillLevel(rider.skill_level)})</span>
                        }</p>
                    {rider.skating_style &&
                        <>
                            <span className="font-medium">Skating style: </span>
                            {skatingStyles}
                        </>
                    }
                </div>
            }
        </>
    )
}