import { useEffect, useState } from "react";
import Skater from "../../../../assets/skater.png";
import { SKATING_STYLES } from "../../../../config/user_info";
import { getUserProfile } from "../../../../services/auth";
import type { UserProfile } from "../../../../types/user_types";
import { showAvatar, showFlag } from "../../../profile/utils";

export function RiderCard({ riderId }: { riderId: string }) {

    const [rider, setRider] = useState<UserProfile | null>(null);

    useEffect(() => {
        const getRider = async () => {
            const { data } = await getUserProfile(riderId);
            setRider(data);
        };
        getRider();
    }, []);

    return (
        <>
            {rider &&
                <div className="card bg-bg-secondary bg-blur w-max">
                    <div className="flex flex-col items-center justify-center gap-0.5">
                        <img src={showAvatar(rider)} alt="Profile avatar" className="profile-avatar" onError={(e) => {
                            const img = e.currentTarget;
                            if (img.src !== Skater) {
                                img.src = Skater;
                            }
                        }} />
                        {showFlag(rider.home_country_code)}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1 text-sm text-left text-text-secondary">
                        <p className="font-title">Rider: <span className="text-text">{rider.name}</span></p>
                        <div className="font-main text-sm font-light flex flex-col mt-0.5 gap-[3px]">
                            <span className="font-title pb">Skating style:</span>
                            {rider.skating_style && rider.skating_style.map((style, i) => (
                                <p className="font-medium text-xs text-text" key={i}>{SKATING_STYLES
                                    .filter(s => s.value === style)
                                    .map(s => s.label)
                                }</p>
                            ))}
                        </div>
                    </div>
                </div>}
        </>
    )
}