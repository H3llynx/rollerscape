import { useState } from "react";
import { databases } from "../../../config/databases";
import { geolocationErrors } from "../../../config/errors";
import { updateData } from "../../../services/data";
import type { HomeLocation } from "../../../types/geolocation_types";
import { useAuth } from "../../auth/hooks/useAuth";

export function useLocate() {
    const [loading, setLoading] = useState<boolean>(false);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const { profile, setProfile } = useAuth();

    const updateUserLocation = async (userId: string, location: HomeLocation) => {
        try {
            setLoading(true);
            const updatedLocation = {
                home_country_code: location.country,
                home_lat: location.lat,
                home_location_name: location.name,
                home_lon: location.lon
            };
            const { data, error } = await updateData({ id: userId, ...updatedLocation }, databases.profiles);
            if (error) {
                setUpdateError(geolocationErrors.locationUpdate);
            }
            else {
                setProfile(data);

            }
        }
        finally { setLoading(false) };
    };

    return { loading, updateError, setUpdateError, updateUserLocation }
}