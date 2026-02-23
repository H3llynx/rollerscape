import { useState } from "react";
import { databases } from "../../../config/databases";
import { geolocationErrors } from "../../../config/errors";
import { updateData } from "../../../services/data";
import type { HomeLocation } from "../../../types/geolocation_types";
import type { UserProfile } from "../../../types/user_types";
import { useAuth } from "../../auth/hooks/useAuth";

export function useLocate() {
    const [loading, setLoading] = useState<boolean>(false);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const { profile, setProfile } = useAuth();

    const updateUserLocation = async (location: HomeLocation) => {
        try {
            setLoading(true);
            const updatedProfile = {
                ...profile,
                home_country_code: location.country,
                home_lat: location.lat,
                home_location_name: location.name,
                home_lon: location.lon
            } as UserProfile;

            const { data, error } = await updateData(updatedProfile, databases.profiles);
            if (error) setUpdateError(geolocationErrors.locationUpdate);
            else {
                setProfile(data);

            }
        }
        finally { setLoading(false) };
    };
    return { loading, updateError, setUpdateError, updateUserLocation }
}