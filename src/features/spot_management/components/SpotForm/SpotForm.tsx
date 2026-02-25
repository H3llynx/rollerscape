
import { Camera, Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "../../../../components/Button/Button";
import { IconInput } from "../../../../components/IconInput/IconInput";
import { Input } from "../../../../components/Input/Input";
import { Loading } from "../../../../components/Loading/Loading";
import { databases } from "../../../../config/databases";
import { spotErrors } from "../../../../config/errors";
import { addSpotFields, SPOT_TYPES, TRAFFIC_LEVELS } from "../../../../config/spots";
import { updateData } from "../../../../services/data";
import { hostImg } from "../../../../services/image-hosting";
import type { Coordinates } from "../../../../types/geolocation_types";
import type { Spot, SpotType, TrafficLevel } from "../../../../types/spots_types";
import { useSpots } from "../../../map/hooks/useSpots";
import "../../styles/spot_management.css";

type SpotForm = {
    isAdding: boolean;
    locationType?: Spot["location_type"];
    spotCoordinates: Coordinates[] | null;
    onSubmit: (newSpot: Record<string, unknown>) => void;
}

export function SpotForm({ isAdding, locationType, spotCoordinates, onSubmit }: SpotForm) {
    const { name, coordinates, photos, description, surface_quality, spot_types, traffic_levels } = addSpotFields;
    const { register, handleSubmit, setValue, watch, formState: { isSubmitting, errors } } = useForm();
    const hasPhoto = watch(photos.db_key);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { selectedSpot, setSelectedSpot } = useSpots();
    const [selectedTypes, setSelectedTypes] = useState<SpotType[]>(selectedSpot ? selectedSpot.spot_spot_types.map(t => t.name) : watch(spot_types.db_key) || []);
    const [selectedTrafficLevel, setSelectedTrafficLevel] = useState<TrafficLevel[]>(selectedSpot ? selectedSpot.spot_traffic_levels.map(t => t.name) : watch(traffic_levels.db_key) || []);
    const [error, setError] = useState<boolean>(false);
    const selectedScore = watch(surface_quality.db_key) as number;

    useEffect(() => {
        if (spotCoordinates) setValue(coordinates.db_key, spotCoordinates);
    }, [spotCoordinates]);


    useEffect(() => {
        register(
            spot_types.db_key, {
            validate: (value) => (value && value.length > 0) || spotErrors.add.missing_spot_type
        });
        register(
            traffic_levels.db_key, {
            validate: (value) => (value && value.length > 0) || spotErrors.add.missing_traffic_level
        }
        );
    }, [register, spot_types.db_key, traffic_levels.db_key]);


    const onCancel = () => {
        navigate("/");
    }

    const handleTypeChange = (value: SpotType) => {
        const current = selectedTypes;
        const updated = current.includes(value)
            ? current.filter(type => type !== value)
            : [...current, value];
        setSelectedTypes(updated);
        setValue(spot_types.db_key, updated, { shouldValidate: true });
    };

    const handleLevelChange = (value: TrafficLevel) => {
        const current = selectedTrafficLevel;
        const updated = current.includes(value)
            ? current.filter(level => level !== value)
            : [...current, value];
        setSelectedTrafficLevel(updated);
        setValue(traffic_levels.db_key, updated, { shouldValidate: true });
    };

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length) {
            const urls = await Promise.all(files.map(file => hostImg(file)));
            setValue(photos.db_key, urls);
        } else setValue(photos.db_key, null);
    };

    const deletePhoto = async (picture: string) => {
        if (!selectedSpot) return;
        if (!selectedSpot.photos) return;
        const newPhotosArr = selectedSpot.photos.filter(p => p !== picture);
        const { error } = await updateData({ id: selectedSpot.id, photos: newPhotosArr }, databases.spots);
        if (error) {
            setError(true);
            return
        };
        setSelectedSpot({ ...selectedSpot, photos: newPhotosArr })
    };

    const handlePhotoClear = () => {
        if (fileInputRef.current) fileInputRef.current.value = "";
        setValue(photos.db_key, null);
    };

    return (
        <div className="flex flex-col gap-1 pb-2 md:py-2">
            <div className="flex gap-2 justify-between items-center">
                {isAdding
                    ? <h2>Add a new spot</h2>
                    : <h2>Edit spot</h2>
                }
                <Button style="tertiary" onClick={onCancel}>Cancel</Button>
            </div>
            {isAdding &&
                <p className="md:font-special">Location type: <span className="font-light text-text-secondary">
                    {locationType}
                </span>
                </p>
            }
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 md:pr-1 w-full">
                <Input
                    label={name.label}
                    id={name.id}
                    variant="text"
                    type={name.input_type}
                    defaultValue={selectedSpot ? selectedSpot.name : ""}
                    {...register(name.db_key)}
                    icons
                    required
                />
                <label htmlFor="surface_quality.id">
                    <span>{surface_quality.label}</span>
                    <input
                        id={surface_quality.id}
                        type={surface_quality.input_type}
                        defaultValue={selectedSpot && selectedSpot.surface_quality ? selectedSpot.surface_quality : undefined}
                        {...register(surface_quality.db_key, { valueAsNumber: true })}
                        min={surface_quality.min}
                        max={surface_quality.max}
                        className="sr-only"
                        required
                    />
                    <div className="surface-quality-container" aria-hidden>
                        {[5, 4, 3, 2, 1].map((score) => {
                            const isActive = score <= selectedScore;
                            return (
                                <Button
                                    key={score}
                                    style="icon"
                                    type="button"
                                    onClick={() => setValue(surface_quality.db_key, score, { shouldValidate: true })}
                                >
                                    {isActive ?
                                        <Star fill="var(--color-text)" />
                                        : <Star />
                                    }
                                </Button>
                            )
                        })}
                    </div>
                </label>
                <fieldset>
                    <p className="md:font-special mb-0.5">{spot_types.label}:</p>
                    <div className="spot-types-grid">
                        {SPOT_TYPES.map((type) => (
                            <IconInput
                                key={type.value}
                                id={type.value}
                                label={type.label}
                                type={spot_types.input_type}
                                value={type.value}
                                checked={selectedTypes.includes(type.value)}
                                onChange={() => handleTypeChange(type.value)}
                            >
                                <img src={type.img} alt={type.label} />
                            </IconInput>
                        ))}
                    </div>
                    {errors[spot_types.db_key] && (
                        <p className="error">{errors[spot_types.db_key]?.message as string}</p>
                    )}
                </fieldset>
                <fieldset>
                    <p className="md:font-special">{description.label}:</p>
                    <textarea
                        id={description.id}
                        defaultValue={selectedSpot && selectedSpot.description ? selectedSpot.description : undefined}
                        className="slight-shadow bg-blur border border-grey rounded-lg px-1 py-0.5 min-h-6 w-full"
                        {...register(description.db_key)}
                    />
                </fieldset>
                <fieldset>
                    {TRAFFIC_LEVELS.map(level => (
                        <Input
                            key={level.value}
                            variant="checkbox"
                            id={level.value}
                            label={level.label}
                            type={traffic_levels.input_type}
                            value={level.value}
                            icons={false}
                            checked={selectedTrafficLevel.includes(level.value)}
                            onChange={() => handleLevelChange(level.value)}
                        />
                    ))}
                    {errors[traffic_levels.db_key] && (
                        <p className="error">{errors[traffic_levels.db_key]?.message as string}</p>
                    )}
                </fieldset>
                {isAdding &&
                    <fieldset className="flex">
                        <label htmlFor={photos.id} className="file-label">
                            <Camera className="w-1.5" aria-hidden />
                            <input
                                id={photos.id}
                                className="text-xs font-medium cursor-pointer"
                                type={photos.input_type}
                                ref={fileInputRef}
                                onChange={handlePhotoChange}
                                multiple
                            />
                        </label>
                        {hasPhoto &&
                            <Button type="button" style="icon" aria-label="Remove images" onClick={handlePhotoClear}><X aria-hidden /></Button>
                        }
                    </fieldset>
                }
                {selectedSpot && selectedSpot.photos &&
                    <>
                        <div className="grid grid-cols-3 gap-0.5">
                            {selectedSpot.photos.map((photo, i) => (
                                <div
                                    key={i}
                                    className="relative rounded-md slight-shadow">
                                    <img
                                        src={photo}
                                        alt={`${i} of ${selectedSpot.name}`}
                                    />
                                    <Button
                                        style="icon"
                                        type="button"
                                        aria-label="Remove picture"
                                        className="absolute top-[2px] right-[2px] p-0 w-[20px] h-[20px] bg-bg-rgba-2 rounded-sm"
                                        onClick={() => deletePhoto(photo)}
                                    >
                                        <X aria-hidden className="text-red" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        {error && <p className="error absolute text-xs text-center -mx-1">{spotErrors.delete.picture}
                            <Button
                                style="icon"
                                type="button"
                                aria-label="Close error message"
                                className="inline p-0 align-middle text-red"
                                onClick={() => setError(false)}
                            >
                                <X aria-hidden width={12} />
                            </Button>
                        </p>
                        }
                    </>
                }
                {isSubmitting ? <Loading /> :
                    <Button>{isAdding ? "Add spot" : "Update spot"}</Button>
                }
            </form>
        </div >
    )
}