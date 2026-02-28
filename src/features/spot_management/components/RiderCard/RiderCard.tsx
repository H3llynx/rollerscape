import { Check } from "lucide-react";
import Skater from "../../../../assets/skater.png";
import { SKATING_STYLES } from "../../../../config/user_info";
import { useSpots } from "../../../map/hooks/useSpots";
import { showAvatar } from "../../../profile/utils";

export function RiderCard() {

    const { selectedSpot } = useSpots();
    if (!selectedSpot) return;
    const rider = selectedSpot.creator_profile
    if (!rider) return;

    return (
        <>
            <div className="card bg-bg-secondary bg-blur w-max">
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
                <div className="flex flex-col min-w-0 flex-1 text-sm text-left text-text-secondary">
                    <p className="font-title">Submitter: <span className="text-text">{rider.name}</span></p>

                    {rider.skating_style &&
                        <div className="font-main text-sm font-light">
                            <p className="font-title">Skating style:</p>
                            <ul>
                                {rider.skating_style.map((style, i) => (
                                    <li className="font-medium text-[0.7rem] text-text" key={i}>
                                        <Check aria-hidden width={12} height={12} className="inline mr-[5px]" />
                                        {SKATING_STYLES
                                            .filter(s => s.value === style)
                                            .map(s => s.label)
                                        }
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}