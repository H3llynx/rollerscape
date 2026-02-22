import Riders from "../../../../assets/riders.png";
import { BaseMap } from "../../../../components/BaseMap/BaseMap";
import type { SpotWithTypes } from "../../../../types/spots_types";
import { SpotMarker } from "../../../map/components/SpotMarker/SpotMarker";


export function SingleSpotMap({ spot }: { spot: SpotWithTypes }) {
    return (
        <article className="w-full h-[60dvh] md:z-0 md:absolute md:w-1/2 md:h-full md:top-0 md:right-0">
            <BaseMap center={[spot.display_lat, spot.display_lon]} zoom={16}>
                <SpotMarker
                    key={spot.id}
                    spot={spot}
                    reduced
                />
            </BaseMap>
            <div className="hidden lg:block lg:absolute bottom-0 w-full pointer-events-none drop-shadow-dark drop-shadow-xs relative z-400">
                <img src={Riders} alt="" className="w-full" />
            </div>
        </article>
    )
}