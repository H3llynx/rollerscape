import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { spotErrors } from "../../../config/errors";
import { spotFormFields } from "../../../config/spots";
import { hostImg } from "../../../services/image-hosting";
import type { Coordinates } from "../../../types/geolocation_types";
import type { SpotType, TrafficLevel } from "../../../types/spots_types";
import { compressImage } from "../../../utils/helpers";
import { useSpots } from "../../map/hooks/useContexts";

export function useSpotForm(isAdding: boolean, spotCoordinates: Coordinates[] | null) {
    const { selectedSpot, setSelectedSpot } = useSpots();
    const { coordinates, photos, surface_quality, spot_types, traffic_levels } = spotFormFields;
    const { register, handleSubmit, setValue, watch, formState: { isSubmitting, errors } } = useForm();
    const hasPhoto = watch(photos.db_key);
    const selectedScore = watch(surface_quality.db_key) as number;
    const [error, setError] = useState<boolean>(false);
    const [photoLoading, setPhotoLoading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const spotTypesRef = useRef<HTMLDivElement>(null);

    const [selectedTypes, setSelectedTypes] = useState<SpotType[]>(
        !isAdding && selectedSpot ? selectedSpot.spot_types.map(t => t.name) : []
    );
    const [selectedTrafficLevel, setSelectedTrafficLevel] = useState<TrafficLevel[]>(
        !isAdding && selectedSpot ? selectedSpot.traffic_levels.map(t => t.name) : []
    );
    const [selectedPhotos, setSelectedPhotos] = useState<string[]>(
        !isAdding && selectedSpot?.photos ? selectedSpot.photos : []
    );

    useEffect(() => {
        if (isAdding) setSelectedSpot(null);
    }, [isAdding]);

    useEffect(() => {
        if (spotCoordinates) setValue(coordinates.db_key, spotCoordinates);
    }, [spotCoordinates]);

    useEffect(() => {
        setValue(spot_types.db_key, selectedTypes);
        setValue(traffic_levels.db_key, selectedTrafficLevel);
    }, [selectedTrafficLevel, selectedTypes]);

    useEffect(() => {
        register(
            spot_types.db_key, {
            validate: (value) => (value?.length) || spotErrors.add.missing_spot_type
        });
        register(
            traffic_levels.db_key, {
            validate: (value) => (value?.length) || spotErrors.add.missing_traffic_level
        }
        );
    }, [register, spot_types.db_key, traffic_levels.db_key]);

    useEffect(() => {
        if (errors[spot_types.db_key]) spotTypesRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [errors[spot_types.db_key]]);

    useEffect(() => {
        setValue(photos.db_key, selectedPhotos);
    }, [selectedPhotos]);

    const handlePhotoClear = () => {
        if (fileInputRef.current) fileInputRef.current.value = "";
        setValue(photos.db_key, null);
    };

    const handleTypeChange = (value: SpotType) => {
        const current = selectedTypes;
        const updated = current.includes(value)
            ? current.filter(type => type !== value)
            : [...current, value];
        setSelectedTypes(updated);
    };

    const handleLevelChange = (value: TrafficLevel) => {
        const current = selectedTrafficLevel;
        const updated = current.includes(value)
            ? current.filter(level => level !== value)
            : [...current, value];
        setSelectedTrafficLevel(updated);
    };

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length) {
            setPhotoLoading(true)
            const amount = 10 - selectedPhotos.length;
            const filesToHost = files.slice(0, amount);
            if (files.length > amount) setError(true);
            const compressed = await Promise.all(filesToHost.map(file => compressImage(file)));
            const addedPhotos = await Promise.all(compressed.map(file => hostImg(file)));
            setSelectedPhotos(prev => [...prev, ...addedPhotos]);
            setPhotoLoading(false);
            handlePhotoClear();
        };
    };

    const deletePhoto = (picture: string) => {
        if (!selectedPhotos) return;
        setSelectedPhotos(prev => prev.filter(p => p !== picture));
    };

    return {
        register,
        handleSubmit,
        errors,
        setValue,
        isSubmitting,
        selectedScore,
        selectedTypes,
        selectedTrafficLevel,
        handleTypeChange,
        handleLevelChange,
        selectedPhotos,
        photoLoading,
        error,
        setError,
        fileInputRef,
        spotTypesRef,
        hasPhoto,
        handlePhotoChange,
        deletePhoto
    }
}