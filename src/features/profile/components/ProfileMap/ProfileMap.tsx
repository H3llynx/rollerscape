import Riders from "../../../../assets/riders.png";
import { Map } from "../../../map/components/Map/Map";

export function ProfileMap() {
    return (
        <div className="relative z-0 w-full h-[60dvh] md:h-full md:absolute md:w-1/2 md:top-0 md:right-0">
            <Map zoom={16} />
            <div className="hidden lg:block absolute z-9991 bottom-0 left-0 w-full pointer-events-none drop-shadow-dark drop-shadow-xs">
                <img src={Riders} alt="" className="w-full" />
            </div>
        </div>
    )
}