import { MapPin, PencilOff, Trash2, X } from "lucide-react";
import Skater from "../../../../assets/hero.png";
import { Button } from "../../../../components/Button/Button";
import { useSpots } from "../../../map/hooks/useSpots";
import { SpotForm } from "../SpotForm/SpotForm";

type SpotEdition = {
    onCancel: () => void;
    onDelete: () => void;
}

export function SpotEdition({ onCancel, onDelete }: SpotEdition) {
    const { selectedSpot, setSelectedSpot } = useSpots();
    if (!selectedSpot) return;

    const src = selectedSpot.photos && selectedSpot.photos.length > 0
        ? selectedSpot.photos[0]
        : Skater


    const updateSpot = () => {
        console.log("update me")
    }

    return (
        <>
            <div className="hidden md:block relative  w-full h-[240px] z-0 shadow-sm shadow-rgba-grey">
                <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
            <article className="pb-2 md:py-1 text-sm relative z-1">

                <div className="px-1 md:px-2">
                    <div className="flex gap-2 justify-between items-start">
                        <h1>{selectedSpot.name}</h1>
                        <div className="button-container">
                            <Button style="icon" aria-label="Delete spot" onClick={onDelete}>
                                <Trash2 aria-hidden />
                            </Button>
                            <Button style="icon" aria-label="Cancel edition" onClick={onCancel}>
                                <PencilOff aria-hidden />
                            </Button>
                        </div>
                        <Button style="icon" className="hidden md:block absolute right-0 top-0" aria-label="Cancel" onClick={() => setSelectedSpot(null)}>
                            <X aria-hidden />
                        </Button>
                    </div>
                    <div className="flex items-center gap-[5px] text-grey mt-1">
                        <MapPin aria-hidden width={15} /><span>{selectedSpot.address}</span>
                    </div>
                    <SpotForm
                        isAdding={false}
                        spotCoordinates={selectedSpot.coordinates}
                        onSubmit={updateSpot}
                    />
                </div>
            </article>
        </>
    )
}