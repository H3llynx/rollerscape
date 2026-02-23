import { CheckLine, MapPin, Navigation, Share, X } from "lucide-react";
import Skater from "../../../../assets/hero.png";
import { Button } from "../../../../components/Button/Button";
import { TRAFFIC_LEVELS } from "../../../../config/spots";
import { sendToGps, shareSpot } from "../../../../services/spots";
import type { SpotFullInfo } from "../../../../types/spots_types";
import "./SpotDescription.css";

type SpotDescription = {
    spot: SpotFullInfo;
    setSelectedSpot: (value: SpotFullInfo | null) => void;
}

export function SpotDescription({ spot, setSelectedSpot }: SpotDescription) {
    const src = spot.photos && spot.photos.length > 0
        ? spot.photos[0]
        : Skater

    return (
        <>
            <div className="hidden md:block relative  w-full h-[240px] z-0 shadow-sm shadow-rgba-grey">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <p className="font-special text-xs text-text-secondary absolute bottom-0.5 w-full px-1 md:px-2">
                    Submitted by {spot.created_by}</p>
            </div>
            <div className="pb-2 md:py-1 text-sm relative z-1">

                <div className="px-1 md:px-2">
                    <div className="flex w-full gap-2 justify-between items-start">
                        <div>
                            <h1>{spot.name}</h1>
                            <div className="flex gap-0.5 mt-1">
                                {spot.spot_spot_types.map((type, i) => (
                                    <span className="tag" key={i} >
                                        {type.name.replace("_", " ")}
                                    </span>
                                )
                                )}
                            </div>
                        </div>
                        <div className="button-container">
                            <Button style="icon" aria-label="share spot" onClick={() => shareSpot(spot)}>
                                <Share aria-hidden />
                            </Button>
                            <Button style="icon" aria-label="Send to GPS app" onClick={() => sendToGps(spot)}>
                                <Navigation aria-hidden />
                            </Button>
                        </div>
                        <Button style="icon" className="hidden md:block absolute right-0 top-0" aria-label="Close description" onClick={() => setSelectedSpot(null)}>
                            <X aria-hidden />
                        </Button>
                    </div>
                    <div className="flex items-center gap-[5px] text-grey mt-1">
                        <MapPin aria-hidden width={15} /><span>{spot.address}</span>
                    </div>
                    <div className="w-full flex gap-1 justify-between items-center flex-wrap mt-1">
                        <div className="flex items-center gap-[5px]">
                            <h3>Surface quality:</h3>{spot.surface_quality}/5</div>
                        {spot.has_obstacles && <span className="flex items-center gap-[5px] text-medium text-text-secondary"><CheckLine width={15} /> Obstacles</span>}
                        {spot.length_km &&
                            <div className="flex items-center gap-[5px]"><h3>Distance:</h3>{spot.length_km} km</div>
                        }
                        <div className="flex items-center gap-[5px]">
                            <h3>Traffic level:</h3>
                            {spot.spot_traffic_levels.map(level =>
                                <span key={level.id}>
                                    {TRAFFIC_LEVELS
                                        .filter(l => l.value === level.name)
                                        .map(l => l.label)}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-[5px]">
                            <h3>Average score</h3>{spot.average_rating ? spot.average_rating : (<span className="text-grey text-sm">No valoration given</span>)}
                        </div>
                    </div>
                    {
                        spot.description &&
                        <>
                            <h3 className="mt-1">Description:</h3>
                            {spot.description}
                        </>
                    }
                </div>
                {
                    spot.photos && spot.photos.length > 0 &&
                    <div className="gallery">
                        <h3 className="mt-1">Photos:</h3>
                        <div className="slider">
                            {spot.photos.map((photo, i) => (
                                <img key={i}
                                    src={photo}
                                    alt="" />
                            ))}
                        </div>
                    </div>
                }
            </div >
        </>
    )
}