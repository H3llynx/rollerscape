
import { Camera, Star, X } from "lucide-react";
import { Button } from "../../../../components/Button/Button";
import { IconInput } from "../../../../components/IconInput/IconInput";
import { Input } from "../../../../components/Input/Input";
import { Loading } from "../../../../components/Loading/Loading";
import { spotErrors } from "../../../../config/errors";
import { SPOT_TYPES, spotFormFields, TRAFFIC_LEVELS } from "../../../../config/spots";
import type { Coordinates } from "../../../../types/geolocation_types";
import { useSpots } from "../../../map/hooks/useContexts";
import { useSpotForm } from "../../hooks/useSpotForm";
import "./SpotForm.css";

type SpotForm = {
    isAdding: boolean;
    spotCoordinates: Coordinates[] | null;
    onSubmit: (newSpot: Record<string, unknown>) => void;
}

export function SpotForm({ isAdding, spotCoordinates, onSubmit }: SpotForm) {
    const { selectedSpot, setSelectedSpot } = useSpots();
    const { handleSubmit,
        register,
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
        handlePhotoChange,
        deletePhoto } = useSpotForm(isAdding, spotCoordinates);
    const { name, photos, description, surface_quality, spot_types, traffic_levels } = spotFormFields;

    return (
        <div className="flex flex-col gap-1 pb-2 md:py-2">
            <form
                aria-label={isAdding ? "add spot" : "edit spot"}
                onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label={name.label}
                    id={name.id}
                    variant="text"
                    type={name.input_type}
                    defaultValue={!isAdding && selectedSpot ? selectedSpot.name : ""}
                    {...register(name.db_key)}
                    icons
                    required
                />
                <label htmlFor={surface_quality.id}>
                    <span>{surface_quality.label}</span>
                    <input
                        id={surface_quality.id}
                        type={surface_quality.input_type}
                        defaultValue={!isAdding ? selectedSpot?.surface_quality ?? undefined : undefined}
                        {...register(surface_quality.db_key, { valueAsNumber: true })}
                        min={surface_quality.min}
                        max={surface_quality.max}
                        className="sr-only"
                        required
                    />
                    <div className="score-container" aria-hidden>
                        {[5, 4, 3, 2, 1].map((score) => {
                            const isActive = score <= selectedScore;
                            return (
                                <button
                                    key={score}
                                    type="button"
                                    onClick={() => setValue(surface_quality.db_key, score, { shouldValidate: true })}
                                >
                                    {isActive ?
                                        <Star fill="var(--color-text)" />
                                        : <Star />
                                    }
                                </button>
                            )
                        })}
                    </div>
                </label>
                <fieldset>
                    <legend className="md:pt-1 mb-0.5">{spot_types.label}: <span className="text-text">(Select all that apply)</span></legend>
                    <div className="cards-grid" ref={spotTypesRef}>
                        {SPOT_TYPES.map(type => (
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
                    <legend>{description.label}:</legend>
                    <textarea
                        id={description.id}
                        defaultValue={!isAdding && selectedSpot?.description ? selectedSpot.description : undefined}
                        className="slight-shadow bg-blur"
                        {...register(description.db_key)}
                    />
                </fieldset>
                <fieldset>
                    <legend className="mb-0.5">{traffic_levels.label} <span className="text-text">(Select all that apply)</span></legend>
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
                <div className="flex">
                    <label htmlFor={photos.id} className="file-label">
                        <Camera className="w-1.5" aria-hidden />
                        <input
                            id={photos.id}
                            className="text-xs font-medium cursor-pointer disabled:cursor-not-allowed"
                            type={photos.input_type}
                            ref={fileInputRef}
                            onChange={handlePhotoChange}
                            accept="image/*"
                            disabled={selectedPhotos.length >= 10}
                            multiple
                        />
                    </label>
                </div>
                {selectedPhotos.length > 0 &&
                    <>
                        <div className="grid grid-cols-3 gap-0.5">
                            {selectedPhotos.map((photo, i) => (
                                <div
                                    key={`${photo}-${i}`}
                                    className="relative rounded-md slight-shadow">
                                    <img
                                        src={photo}
                                        alt=""
                                    />
                                    <Button
                                        style="icon"
                                        type="button"
                                        aria-label="Remove picture"
                                        className="absolute top-[2px] right-[2px] p-0 w-[20px] h-[20px] bg-bg-rgba-2 rounded-sm"
                                        onClick={() => { deletePhoto(photo) }}
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
                <div className="flex flex-col gap-1 lg:px-2">
                    {isSubmitting || photoLoading ? <Loading /> :
                        <Button>{isAdding ? "Add spot" : "Update spot"}</Button>
                    }
                    {!isAdding &&
                        <Button style="secondary" onClick={() => setSelectedSpot(null)}>Cancel</Button>
                    }
                </div>
            </form>
        </div >
    )
}