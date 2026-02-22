import { CheckLine, MapPin, Navigation, Share } from "lucide-react";
import { Button } from "../../../../components/Button/Button";
import { sendToGps, shareSpot } from "../../../../services/spots";
import type { SpotWithTypes } from "../../../../types/spots_types";
import "./SpotDescription.css";

export function SpotDescription({ spot }: { spot: SpotWithTypes }) {
    return (
        <>
            <div className="flex justify-between flex-wrap gap-0.5 items-center">
                <h1>{spot.name}</h1>
                <div className="flex">
                    <Button style="icon" aria-label="share spot" onClick={() => shareSpot(spot)}>
                        <Share aria-hidden />
                    </Button>
                    <Button style="icon" aria-label="Send to GPS app" onClick={() => sendToGps(spot)}>
                        <Navigation aria-hidden />
                    </Button>
                </div>
            </div>
            <div className="flex gap-0.5">
                {spot.spot_spot_types.map((type, i) => (
                    <span className="tag" key={i} >
                        {type.name.replace("_", " ")}
                    </span>
                )
                )}
            </div>
            <div className="flex items-center gap-[5px] text-grey my-0.5">
                <MapPin aria-hidden width={15} /><span>{spot.address}</span>
            </div>
            <div className="w-full flex gap-1 justify-between items-center flex-wrap">
                <span>Surface quality: {spot.surface_quality}/5</span>
                {spot.has_obstacles && <span className="flex items-center gap-[5px] text-medium text-text-secondary"><CheckLine width={15} /> Obstacles</span>}
                {spot.length_km && <span className="flex items-center gap-[5px] font-medium">Distance: {spot.length_km} km</span>}
                <span>Average score: {spot.average_rating ? spot.average_rating : (<span className="text-grey text-sm">No valoration given</span>)}</span>
            </div>
            {
                spot.description &&
                <p><span className="font-medium">Description: </span>
                    {spot.description}</p>
            }
            {
                spot.photos && spot.photos.length > 0 &&
                <div className="gallery">
                    {spot.photos.map((photo, i) => (
                        <img key={i}
                            src={photo}
                            alt="" />
                    ))}
                </div>
            }
        </>
    )
}