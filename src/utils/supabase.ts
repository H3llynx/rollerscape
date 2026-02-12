
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
