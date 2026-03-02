import { useEffect, useRef, useState } from "react";
import { Button } from "../../../../components/Button/Button";
import { Dialog } from "../../../../components/Dialog/Dialog";
import { databases, dbSelect, views } from "../../../../config/databases";
import { spotErrors } from "../../../../config/errors";
import { deleteData, fetchDataById } from "../../../../services/data";
import type { SpotFullInfo } from "../../../../types/spots_types";
import { useSpots } from "../../../map/hooks/useSpots";
import { SpotDescription } from "../SpotDescription/SpotDescription";
import { SpotEdition } from "../SpotEdition/SpotEdition";


export function SpotLeftPanel() {
    const [spotToEdit, setSpotToEdit] = useState<SpotFullInfo | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { selectedSpot, setSelectedSpot } = useSpots();
    const { setSpots } = useSpots();
    if (!selectedSpot) return;
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (error || isDeleting) {
            dialogRef.current?.showModal();
        }
    }, [error, isDeleting]);

    useEffect(() => {
        if (spotToEdit && (selectedSpot.id !== spotToEdit.id)) setSpotToEdit(null);
    }, [selectedSpot, spotToEdit])

    const handleClose = () => {
        dialogRef.current?.close();
        setError(null);
        setIsDeleting(false);
    };

    const confirmDelete = () => {
        setIsDeleting(true);
    }

    const deleteSpot = async (spotId: string) => {
        const { error } = await deleteData(spotId, databases.spots);
        if (error) setError(spotErrors.delete.spot);
        setIsDeleting(false);
        setSpots(prev => prev!.filter(spot => spot !== selectedSpot));
        setSelectedSpot(null);
    };

    const handleEditted = async () => {
        setSpotToEdit(null);
        const { data } = await fetchDataById<SpotFullInfo>(views.public_spots, dbSelect.spots.allWithJunctions, "id", selectedSpot.id);
        if (data) setSelectedSpot(data);
    }

    return (
        <>
            {!spotToEdit && <SpotDescription onEdit={() => setSpotToEdit(selectedSpot)} onDelete={confirmDelete} />}
            {spotToEdit && <SpotEdition onCancel={() => setSpotToEdit(null)} onDelete={confirmDelete} onEditted={handleEditted} />}
            <Dialog ref={dialogRef} style={error ? "error" : "default"} close={handleClose}>
                {error && <p>{error}</p>}
                {isDeleting &&
                    <>
                        <p>Are you sure you want to delete <span className="font-title text-lg text-text-secondary">{selectedSpot.name}</span> ?</p>
                        <div className="flex gap-0.5 justify-center">
                            <Button onClick={() => deleteSpot(selectedSpot.id)}>Confirm</Button>
                            <Button style="secondary" onClick={handleClose}>Cancel</Button>
                        </div>
                    </>
                }
            </Dialog>
        </>
    )
}