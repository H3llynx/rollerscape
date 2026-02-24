
import { Camera, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "../../../../components/Button/Button";
import { Input } from "../../../../components/Input/Input";
import { Loading } from "../../../../components/Loading/Loading";
import { spotErrors } from "../../../../config/errors";
import { addSpotFields, SPOT_TYPES, TRAFFIC_LEVELS } from "../../../../config/spots";
import { hostImg } from "../../../../services/image-hosting";
import type { Coordinates, MapCoordinates } from "../../../../types/geolocation_types";
import type { Spot, SpotType, TrafficLevel } from "../../../../types/spots_types";

type AddSpot = {
    center: MapCoordinates;
    locationType: Spot["location_type"];
    spotCoordinates: Coordinates[] | null;
    setSpotCoordinates: (value: Coordinates[]) => void;
    onSubmit: (newSpot: Record<string, unknown>) => void;
}

export function AddSpotForm({ center, locationType, spotCoordinates, setSpotCoordinates, onSubmit }: AddSpot) {
    const { name, coordinates, photos, description, surface_quality, spot_types, traffic_levels } = addSpotFields;
    const { register, handleSubmit, setValue, watch, formState: { isSubmitting, errors } } = useForm();
    const hasPhoto = watch(photos.db_key);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

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
        const current: SpotType[] = watch(spot_types.db_key) || [];
        const updated = current.includes(value)
            ? current.filter(type => type !== value)
            : [...current, value];
        setValue(spot_types.db_key, updated, { shouldValidate: true });

    };

    const handleLevelChange = (value: TrafficLevel) => {
        const current: TrafficLevel[] = watch(traffic_levels.db_key) || [];
        const updated = current.includes(value)
            ? current.filter(level => level !== value)
            : [...current, value];
        setValue(traffic_levels.db_key, updated, { shouldValidate: true });
    };

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length) {
            const urls = await Promise.all(files.map(file => hostImg(file)));
            setValue(photos.db_key, urls);
        } else setValue(photos.db_key, null);
    };

    const handlePhotoClear = () => {
        if (fileInputRef.current) fileInputRef.current.value = "";
        setValue(photos.db_key, null);
    };

    return (
        <div className="flex flex-col gap-1 pb-2 md:py-2">
            <div className="flex gap-2 justify-between items-center">
                <h2>Add a new spot</h2>
                <Button style="tertiary" onClick={onCancel}>Cancel</Button>
            </div>
            <p className="md:font-special">Location type: <span className="font-light text-text-secondary">
                {locationType}
            </span>
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 md:pr-1 w-full">
                {locationType === "point" &&
                    <fieldset>
                        <p className="font-medium mb-0.5">{coordinates.label0}:</p>
                        <div className="flex gap-4">
                            <Input
                                variant="number"
                                type={coordinates.input_type}
                                label={coordinates.label1}
                                id={coordinates.id1}
                                placeholder={center ? String(center![0]) : ""}
                                value={spotCoordinates?.[0]?.lat ?? ""}
                                onChange={(e) => setSpotCoordinates([{ lat: Number(e.target.value), lon: spotCoordinates?.[0]?.lon ?? 0 }])}
                                required />
                            <Input
                                variant="number"
                                type={coordinates.input_type}
                                label={coordinates.label2}
                                id={coordinates.id2}
                                placeholder={center ? String(center![1]) : ""}
                                value={spotCoordinates?.[0]?.lon ?? ""}
                                onChange={(e) => setSpotCoordinates([{ lat: spotCoordinates?.[0]?.lat ?? 0, lon: Number(e.target.value) }])}
                                required />
                        </div>
                    </fieldset>
                }
                <Input
                    label={name.label}
                    id={name.id}
                    variant="text"
                    type={name.input_type}
                    {...register(name.db_key)}
                    icons
                    required
                />
                <Input
                    label={surface_quality.label}
                    id={surface_quality.id}
                    variant="number"
                    type={surface_quality.input_type}
                    {...register(surface_quality.db_key)}
                    min={surface_quality.min}
                    max={surface_quality.max}
                    icons
                    required
                />
                <fieldset>
                    <p className="md:font-special mb-0.5">{spot_types.label}:</p>
                    <div className="grid grid-cols-2 gap-0.5 pb-0.5">
                        {SPOT_TYPES.map((type) => (
                            <label
                                key={type.value}
                                aria-label={type.label}
                                className="bg-bg-rgba-2 p-0 button-shadow cursor-pointer hover:-translate-y-px has-checked:border-text-secondary has-checked:bg-rgba-secondary">
                                <input
                                    key={type.value}
                                    className="sr-only"
                                    type={spot_types.input_type}
                                    value={type.value}
                                    onChange={() => handleTypeChange(type.value)}
                                />
                                <img src={type.img} alt={type.label} />
                            </label>
                        ))}
                    </div>
                    {errors[spot_types.db_key] && (
                        <p className="text-red">{errors[spot_types.db_key]?.message as string}</p>
                    )}
                </fieldset>
                <fieldset>
                    <p className="md:font-special">{description.label}:</p>
                    <textarea
                        id={description.id}
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
                            onChange={() => handleLevelChange(level.value)}
                        />
                    ))}
                    {errors[traffic_levels.db_key] && (
                        <p className="text-red">{errors[traffic_levels.db_key]?.message as string}</p>
                    )}
                </fieldset>
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
                        <Button type="button" style="tertiary" aria-label="Remove images" onClick={handlePhotoClear}><X aria-hidden /></Button>
                    }
                </fieldset>
                <Button style="primary">{isSubmitting ? <Loading /> : "Add spot"}</Button>
            </form>
        </div>
    )
}