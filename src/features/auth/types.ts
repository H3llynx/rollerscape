export type UserProfile = {
    id: string;
    name: string;
    avatar_url: string;
    updated_at: string;
    home_country_code: string | null
    home_lat: number | null
    home_location_name: string | null
    home_lon: number | null
}

export type Credentials = {
    name?: string;
    email: string;
    password: string;
}