import { MapPin, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../../../components/Button/Button";
import { Dialog } from "../../../../components/Dialog/Dialog";
import { Dropdown } from "../../../../components/Dropdown/Dropdown";
import { Input } from "../../../../components/Input/Input";
import { databases } from "../../../../config";
import { updateData } from "../../../../services/data";
import { useAuth } from "../../../auth/hooks/useAuth";
import type { UserProfile } from "../../../auth/types";
import { countries, geolocationErrors, profileLocationUpdateError } from "../../config";
import { getBrowserPosition, getCoordinates, reverseGeocode, searchLocations } from "../../services";
import type { HomeLocation, Location } from "../../types";

export function LocationRequest() {
    const [query, setQuery] = useState<string>("");
    const [suggestions, setSuggestions] = useState<Location[]>([]);
    const [country, setCountry] = useState<string>(countries[0].value);
    const [showingSuggestions, setShowingSuggestions] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null)
    const dialogRef = useRef<HTMLDialogElement>(null);
    const { profile, setProfile } = useAuth();

    useEffect(() => {
        const search = async () => {
            const results = await searchLocations(query, country);
            setSuggestions(results);
        };
        search();
    }, [query, country]);

    useEffect(() => {
        if (error) {
            dialogRef.current?.showModal();
        }
    }, [error]);

    const updateUserLocation = async (location: HomeLocation) => {
        if (!location) return;
        const updatedProfile = {
            ...profile,
            home_country_code: location.country,
            home_lat: location.lat,
            home_location_name: location.name,
            home_lon: location.lon
        } as UserProfile;

        const { data, error } = await updateData(updatedProfile, databases.profiles);
        if (error) setError(profileLocationUpdateError);
        else {
            setProfile(data);
            if (query) setQuery("");
        }
    };

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
        setShowingSuggestions(false);
    };

    const handleClose = () => {
        dialogRef.current?.close();
        setError(null);
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        const { data, error } = await getCoordinates(query);
        if (error) setError(geolocationErrors.coordinates_issue)
        if (data) {
            const location: HomeLocation = {
                lat: data.lat,
                lon: data.lon,
                name: query,
                country: country
            };
            updateUserLocation(location);
        }
    };

    const useBrowserLocation = async () => {
        const { data, error } = await getBrowserPosition();
        if (error) {
            if ("code" in error)
                setError(geolocationErrors[error.code as keyof typeof geolocationErrors] || geolocationErrors[2]);
            else setError(geolocationErrors[2])
        };
        if (data) {
            const location = await reverseGeocode(data);
            updateUserLocation(location);
        }
    };

    return (
        <section className="w-fit m-auto flex flex-col gap-2 items-center px-3 py-2 text-center">
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
                    {countries.map(country => {
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
                                    <MapPin width={15} className="shrink-0 text-yellow" />{location.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <Button>Set home location</Button>
                <p className="separator">OR</p>
                <Button style="secondary" type="button" onClick={useBrowserLocation}>Use your current location</Button>
            </form>
            <Dialog ref={dialogRef} style="error" close={handleClose}>
                <p>{error}</p>
            </Dialog>
        </section>
    )
}