
import { Camera } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "../../../../components/Button/Button";
import { Dropdown } from "../../../../components/Dropdown/Dropdown";
import { Input } from "../../../../components/Input/Input";
import { Loading } from "../../../../components/Loading/Loading";
import { addSpotFields, SPOT_TYPES } from "../../../../config/spots";
import { hostImg } from "../../../../services/image-hosting";
import type { MapCoordinates } from "../../../../types/geolocation_types";
import type { JsonCoordinates, Spot, SpotType } from "../../../../types/spots_types";
import { capitalize } from "../../../../utils/helpers";
import "./AddSpotForm.css";

type AddSpot = {
    center: MapCoordinates;
    locationType: Spot["location_type"];
    spotCoordinates: JsonCoordinates | null;
    setSpotCoordinates: (value: JsonCoordinates) => void;
    onSubmit: (newSpot: Record<string, unknown>) => void;
}

export function AddSpotForm({ center, locationType, spotCoordinates, setSpotCoordinates, onSubmit }: AddSpot) {
    const { name, coordinates, photos, description, surface_quality, spot_types, traffic_level } = addSpotFields;
    const { register, handleSubmit, setValue, watch, formState: { isSubmitting, errors } } = useForm();
    const hasPhoto = watch(photos.db_key);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (spotCoordinates) setValue(coordinates.db_key, spotCoordinates);
    }, [spotCoordinates]);

    useEffect(() => {
        register(spot_types.db_key, {
            validate: (value) => (value && value.length > 0) || "Please select at least one option!"
        });
    }, [register]);

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
        <div className="add-spot-form-container bg-blur dialog-shadow scroll">
            <div className="flex gap-2 justify-between">
                <p className="font-special">Location type: <span className="font-light text-text-secondary">
                    {locationType}
                </span>
                </p>
                <Button style="tertiary" className="pt-0" onClick={onCancel}>Cancel</Button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1 pr-1 w-full">
                {locationType === "point" &&
                    <div>
                        <p className="font-medium text-sm mb-0.5">{coordinates.label0}:</p>
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
                    </div>
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
                <div>
                    <p className="font-special mb-0.5">{spot_types.label}:</p>
                    {SPOT_TYPES.map((type) => (
                        <Input key={type.value}
                            variant="checkbox"
                            type="checkbox"
                            value={type.value}
                            icons={false}
                            label={type.label}
                            onChange={() => handleTypeChange(type.value)}
                        />
                    ))}
                    {errors[spot_types.db_key] && (
                        <p className="text-red text-sm">{errors[spot_types.db_key]?.message as string}</p>
                    )}
                </div>
                <p className="font-special">{description.label}:</p>
                <textarea
                    id={description.id}
                    className="slight-shadow bg-blur border text-sm border-grey rounded-lg px-1 py-0.5"
                    {...register(description.db_key)}
                />
                <Dropdown
                    id={traffic_level.id}
                    label={traffic_level.label}
                    {...register(traffic_level.db_key)}
                >
                    {traffic_level.options.map((option) => {
                        return (
                            <option key={option.value} value={option.value}>{capitalize(option.label)}</option>
                        )
                    })}
                </Dropdown>
                <label htmlFor={photos.id} className="img-label">
                    <Camera className="w-1.5" aria-hidden />
                    <input
                        id={photos.id}
                        className="text-xs font-medium cursor-pointer"
                        type={photos.input_type}
                        ref={fileInputRef}
                        onChange={handlePhotoChange}
                        multiple
                    />
                    {hasPhoto &&
                        <Button type="button" style="tertiary" onClick={handlePhotoClear}>Cancel</Button>
                    }
                </label>
                <Button style="primary">{isSubmitting ? <Loading /> : "Add spot"}</Button>
            </form>
        </div>
    )
}