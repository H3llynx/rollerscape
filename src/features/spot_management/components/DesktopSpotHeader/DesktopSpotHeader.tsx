import Skater from "../../../../assets/hero.png";
import { useSpots } from "../../../map/hooks/useSpots";
import { RiderCard } from "../RiderCard/RiderCard";

export function DesktopSpotHeader() {
    const { selectedSpot } = useSpots();
    if (!selectedSpot) return;

    const src = selectedSpot.photos && selectedSpot.photos.length > 0
        ? selectedSpot.photos[0]
        : Skater

    return (
        <div className="hidden md:block relative w-full h-[240px] z-0 shadow-sm shadow-rgba-grey">
            <img src={src} onError={(e) => {
                const img = e.currentTarget;
                if (img.src !== Skater) {
                    img.src = Skater;
                }
            }}
                alt="" className="w-full h-full object-cover" />
            {selectedSpot.creator_profile &&
                <>
                    <p className="spot-created-by bg-blur cursor-pointer">
                        Submitted by <span className="font-bold text-text-secondary" tabIndex={0}>
                            {selectedSpot.creator_profile.name}</span>
                    </p>
                    <div className="rider-card-container right-[5px] bottom-[28px]">
                        <RiderCard />
                    </div>
                </>
            }
        </div>
    )
}