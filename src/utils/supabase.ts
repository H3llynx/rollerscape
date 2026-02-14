import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        flowType: 'pkce', // ← Force PKCE (query params) au lieu d'implicit (hash)
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

export default supabase

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
                updated_at: string | null
                user_type: string | null
            }
            Insert: {
                avatar_url?: string | null
                home_country_code?: string | null
                home_lat?: number | null
                home_location_name?: string | null
                home_lon?: number | null
                id: string
                name?: string | null
                updated_at?: string | null
                user_type?: string | null
            }
            Update: {
                avatar_url?: string | null
                home_country_code?: string | null
                home_lat?: number | null
                home_location_name?: string | null
                home_lon?: number | null
                id?: string
                name?: string | null
                updated_at?: string | null
                user_type?: string | null
            }
            Relationships: []
        }
    }
};