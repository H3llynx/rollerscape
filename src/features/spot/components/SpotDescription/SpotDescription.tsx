import { CheckLine, MapPin, Navigation, Share } from "lucide-react";
import Rollers from "../../../../assets/rollerblades.jpg";
import { Button } from "../../../../components/Button/Button";
import { sendToGps, shareSpot } from "../../../../services/spots";
import type { SpotWithTypes } from "../../../../types/spots_types";
import "./SpotDescription.css";

export function SpotDescription({ spot }: { spot: SpotWithTypes }) {
    const src = spot.photos && spot.photos.length > 0
        ? spot.photos[0]
        : Rollers

    return (
        <>
            <img src={src} alt="" className="hidden md:block w-full h-[240px] object-cover z-0 shadow-sm shadow-rgba-grey" />
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
            </div>
        </>
    )
}