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
    }
};