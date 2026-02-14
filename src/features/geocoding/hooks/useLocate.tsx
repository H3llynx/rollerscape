import { useState } from "react";
import { databases } from "../../../config";
import { updateData } from "../../../services/data";
import { useAuth } from "../../auth/hooks/useAuth";
import type { UserProfile } from "../../auth/types";
import { profileLocationUpdateError } from "../config";
import type { HomeLocation } from "../types";

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
            if (error) setUpdateError(profileLocationUpdateError);
            else {
                setProfile(data);

            }
        }
        finally { setLoading(false) };
    };
    return { loading, updateError, setUpdateError, updateUserLocation }
}