import { CheckLine, MapPin } from "lucide-react";
import type { SpotWithTypes } from "../../../../types/spots_types";
import { capitalize } from "../../../../utils/helpers";
import "./SpotDescription.css";

export function SpotDescription({ spot }: { spot: SpotWithTypes }) {
    return (
        <article className="grid-left-article text-base items-start scroll">
            <h1>{spot.name}</h1>
            <div className="flex gap-0.5">
                {spot.spot_spot_types.map(spot => (
                    <span className="tag">{capitalize(spot.spot_types.name)}</span>
                ))}
            </div>
            <div className="flex items-center gap-[5px] text-grey">
                <MapPin aria-hidden width={15} /><span>{spot.address}</span>
            </div>
            <div className="w-full flex gap-2 justify-between items-center flex-wrap">
                <span>Surface quality: {spot.surface_quality}/5</span>
                {spot.has_obstacles && <span className="flex items-center gap-[5px] text-medium text-text-secondary"><CheckLine width={15} /> Obstacles</span>}
                <span>Average score: {spot.average_rating ? spot.average_rating : (<span className="text-grey text-sm">No valoration given</span>)}</span>
            </div>
            {spot.description &&
                <p><span className="font-medium">Description: </span>
                    {spot.description}</p>
            }
            {spot.photos &&
                <div className="gallery">
                    {spot.photos.map((photo, i) => (
                        <img key={i}
                            src={photo}
                            alt="" />
                    ))}
                </div>
            }
        </article>
    )
}