import { useState } from "react";
import { databases } from "../../../../config/databases";
import { deleteData } from "../../../../services/data";
import { useSpots } from "../../../map/hooks/useSpots";
import { SpotDescription } from "../SpotDescription/SpotDescription";
import { SpotEdition } from "../SpotEdition/SpotEdition";

type SpotLeftPanel = {
    onDelete: () => void;
}

export function SpotLeftPanel({ onDelete }: SpotLeftPanel) {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(true);
    const { selectedSpot, setSelectedSpot } = useSpots();
    const { loadSpots } = useSpots();
    if (!selectedSpot) return;

    const deleteSpot = async (spotId: string) => {
        const { error } = await deleteData(spotId, databases.spots);
        if (error) setError(true);
        setSelectedSpot(null);
        loadSpots();
        onDelete();
    };

    return (
        <>
            {!isEditing && <SpotDescription onEdit={() => setIsEditing(true)} onDelete={() => deleteSpot(selectedSpot.id)} />}
            {isEditing && <SpotEdition onCancel={() => setIsEditing(false)} onDelete={() => deleteSpot(selectedSpot.id)} />}
        </>
    )
}