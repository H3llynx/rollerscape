import { MapPin, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../../../components/Button/Button";
import { Dialog } from "../../../../components/Dialog/Dialog";
import { Dropdown } from "../../../../components/Dropdown/Dropdown";
import { Input } from "../../../../components/Input/Input";
import { Loading } from "../../../../components/Loading/Loading";
import { COUNTRIES, geolocationErrorsProfile } from "../../../../config/geolocation";
import { getBrowserPosition, reverseGeocode, searchLocations } from "../../../../services/geolocation";
import type { Location } from "../../../../types/geolocation_types";
import { useLocate } from "../../hooks/useLocate";
import "./LocationRequest.css";

type LocationRequest = {
    onSuccess?: () => void;
}

export function LocationRequest({ onSuccess }: LocationRequest) {
    const [query, setQuery] = useState<string>("");
    const [suggestions, setSuggestions] = useState<Location[]>([]);
    const [location, setLocation] = useState<Location | null>(null);
    const [country, setCountry] = useState<string>(COUNTRIES[0].value);
    const [showingSuggestions, setShowingSuggestions] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null)
    const dialogRef = useRef<HTMLDialogElement>(null);
    const { loading, updateError, setUpdateError, updateUserLocation } = useLocate();

    useEffect(() => {
        const search = async () => {
            const results = await searchLocations(query, country);
            setSuggestions(results);
        };
        search();
    }, [query, country]);

    useEffect(() => {
        if (error || updateError) {
            dialogRef.current?.showModal();
        }
    }, [error, updateError]);

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCountry(e.target.value);
        setQuery("");
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setShowingSuggestions(true);
    };

    const handleRemove = () => {
        if (query.length === 0) return;
        setQuery("");
        setShowingSuggestions(true);
    };

    const handleSelect = (location: Location) => {
        setQuery(location.name);
        setLocation(location);
        setShowingSuggestions(false);
    };

    const handleClose = () => {
        dialogRef.current?.close();
        setError(null);
        setUpdateError(null);
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!location) return;
        const homeLocation = { ...location, country };
        await updateUserLocation(homeLocation);
        setQuery("");
        if (onSuccess) onSuccess();
    };

    const useBrowserLocation = async () => {
        if (query.length > 0) setQuery("");
        const { data, error } = await getBrowserPosition();
        if (error) {
            if ("code" in error)
                setError(geolocationErrorsProfile[error.code as keyof typeof geolocationErrorsProfile] || geolocationErrorsProfile[2]);
            else setError(geolocationErrorsProfile[2])
        };
        if (data) {
            const location = await reverseGeocode(data);
            updateUserLocation(location);
            if (onSuccess) onSuccess();
        }
    };

    return (
        <>
            <h2>
                Where do you roll?
            </h2>
            <p className="font-special">Set your location to discover spots nearby</p>
            <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-1.5">
                <Dropdown
                    id="country"
                    onChange={handleCountryChange}
                >
                    {COUNTRIES.map(country => {
                        return (
                            <option key={country.value} value={country.value}>{country.label}</option>
                        )
                    })}
                </Dropdown>
                <div className="relative">
                    <Input
                        type="text"
                        icons={false}
                        value={query}
                        onChange={handleLocationChange}
                        placeholder="Search location..."
                    />
                    <button
                        onClick={handleRemove}
                        aria-label="Remove location"
                        className="absolute top-1/2 -translate-y-1/2 -right-2 hover:text-yellow">
                        <X aria-hidden />
                    </button>
                    {suggestions.length > 0 && showingSuggestions && (
                        <ul className="suggestions-ul bg-blur">
                            {suggestions.map((location, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSelect(location)}
                                    tabIndex={0}
                                >
                                    <MapPin width={15} className="shrink-0 text-yellow" />{location.display_name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {loading ? <Loading /> :
                    <>
                        <Button>Set home location</Button>
                        <p className="separator">OR</p>
                        <Button style="secondary" type="button" onClick={useBrowserLocation}>Use your current location</Button>
                    </>
                }
            </form>
            <Dialog ref={dialogRef} style="error" close={handleClose}>
                <p>{error}</p>
            </Dialog>
        </>
    )
}