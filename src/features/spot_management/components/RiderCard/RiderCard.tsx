import Skater from "../../../../assets/skater.png";
import { getSkatingStyles, getSkillLevel } from "../../../../utils/helpers";
import { useSpots } from "../../../map/hooks/useContexts";
import { showAvatar } from "../../../profile/utils";

export function RiderCard({ desktop = true }: { desktop?: boolean }) {
    const { selectedSpot } = useSpots();
    if (!selectedSpot) return;
    const rider = selectedSpot.creator_profile
    if (!rider) return;

    const skatingStyles = (
        <>
            {rider.skating_style.length > 1 ?
                <ul className="mx-0 mt-[5px] md:text-[0.7rem] flex flex-wrap gap-[5px]">
                    {rider.skating_style.map((style, i) => (
                        <li key={i} className="px-0.5 py-[3px] rounded-md bg-bg-rgba-2 font-medium text-grey">
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
                <div className="card bg-rgba-grey bg-blur max-w-3xs">
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
                    <div className="flex flex-col min-w-0 flex-1 text-left text-sm">
                        <p className="text-text-secondary">{rider.name} {rider.skill_level &&
                            <span className="text-[0.6rem] text-white">({getSkillLevel(rider.skill_level)})</span>
                        }
                        </p>
                        {rider.skating_style && skatingStyles}
                    </div>
                </div >
            }
            {
                !desktop &&
                <div className="mt-1 border border-border opacity-80 rounded-lg p-0.5 text-border text-xs">
                    <p className="pb-[5px]">Submitted by <span className="text-text-secondary font-bold">
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