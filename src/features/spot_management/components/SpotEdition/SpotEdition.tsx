import { MapPin, X } from "lucide-react";
import { useRef, useState } from "react";
import Skater from "../../../../assets/hero.png";
import { Button } from "../../../../components/Button/Button";
import { Dialog } from "../../../../components/Dialog/Dialog";
import { databases } from "../../../../config/databases";
import { udpdateError } from "../../../../config/errors";
import { spotFormFields } from "../../../../config/spots";
import { updateDataWithJunctions } from "../../../../services/data";
import { reverseGeocode } from "../../../../services/geolocation";
import { getSpotTypes, getTrafficLevels } from "../../../../services/spots";
import type { JunctionInsert, Spot, SpotType, TrafficLevel } from "../../../../types/spots_types";
import { createSlug } from "../../../../utils/helpers";
import { useSpots } from "../../../map/hooks/useContexts";
import { ButtonContainer } from "../ButtonContainer/ButtonContainer";
import { SpotForm } from "../SpotForm/SpotForm";

type SpotEdition = {
    onCancel: () => void;
    onDelete: () => void;
    onEditted: () => void;
}

export function SpotEdition({ onCancel, onDelete, onEditted }: SpotEdition) {
    const { selectedSpot, setSelectedSpot } = useSpots();
    const [error, setError] = useState<string | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);

    if (!selectedSpot) return;

    const src = selectedSpot.photos?.length
        ? selectedSpot.photos[0]
        : Skater

    const { name, description, surface_quality, spot_types, traffic_levels, photos } = spotFormFields;

    const handleClose = () => {
        dialogRef.current?.close();
        setError(null);
    };


    const updateSpot = async (spot: Record<string, unknown>) => {
        const selectedLevels = spot[traffic_levels.db_key] as TrafficLevel[];
        const selectedTypes = spot[spot_types.db_key] as SpotType[];
        const coords = selectedSpot.coordinates;
        const geo = await reverseGeocode(coords[0]);
        const slug = createSlug(`${spot[name.db_key]}-${geo.city}`);
        const { data: typeRows } = await getSpotTypes(selectedTypes);
        const { data: levelRows } = await getTrafficLevels(selectedLevels);

        const values = {
            name: spot[name.db_key],
            description: spot[description.db_key] || null,
            surface_quality: spot[surface_quality.db_key],
            photos: spot[photos.db_key as keyof Spot] as string[] || [],
            slug,
        }

        const junctions: JunctionInsert[] = [
            { table: "spot_spot_types", fKey: "spot_type_id", values: typeRows?.map(row => row.id) ?? [] },
            { table: "spot_traffic_levels", fKey: "traffic_level_id", values: levelRows?.map(row => row.id) ?? [] }
        ]

        const { error } = await updateDataWithJunctions(databases.spots, selectedSpot.id, values, junctions);
        if (error) {
            setError(udpdateError)
            return
        }
        onEditted();
    }

    return (
        <section id={`spot-edition-${selectedSpot.id}`}>
            <div className="hidden md:block relative  w-full h-[240px] z-0 shadow-sm shadow-rgba-grey">
                <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
            <article>
                <div className="p-1 md:p-2 flex justify-between w-full items-start">
                    <div className="md:w-2xs">
                        <h1 className="font-main md:font-title">{selectedSpot.name}</h1>
                        <div className="text-grey mt-1">
                            <MapPin aria-hidden width={15} className="inline" /><span className="align-middle">{selectedSpot.address}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-0.5 items-end">
                        <ButtonContainer spot={selectedSpot} variant="update" onDelete={onDelete} onCancel={onCancel} />
                        <Button style="icon" aria-label="Close description" className="text-grey py-0 md:absolute top-0 right-0" onClick={() => setSelectedSpot(null)}>
                            <X aria-hidden />
                        </Button>
                    </div>
                </div>
                <div className="px-1 md:px-2">
                    <SpotForm
                        isAdding={false}
                        spotCoordinates={selectedSpot.coordinates}
                        onSubmit={updateSpot}
                    />
                </div>
            </article>
            <Dialog ref={dialogRef} style="error" close={handleClose}>
                <p>{error}</p>
            </Dialog>
        </section>
    )
}