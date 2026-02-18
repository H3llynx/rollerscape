export type Database = {
    Tables: {
        profiles: {
            Row: {
                avatar_url: string | null
                home_country_code: string | null
                home_lat: number | null
                home_location_name: string | null
                home_lon: number | null
                id: string
                name: string | null
                preferred_spot_types: string[] | null
                skating_style: string | null
                skill_level: string | null
                updated_at: string | null
                user_type: string | null
            }
        }
        spots: {
            Row: {
                address: string | null
                average_rating: number | null
                city: string
                coordinates: JSON
                country: string
                description: string | null
                display_lat: number | null
                display_lon: number | null
                has_obstacles: boolean | null
                id: string
                length_km: number | null
                location_type: string | null
                name: string
                spot_types: string[]
                surface_quality: number | null
                total_ratings: number | null
                traffic_level: string | null
                photos: string[] | null
                created_at: string | null
                created_by: string | null
                updated_at: string | null
            }
        }
    }
};
