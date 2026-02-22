import type { Credentials } from "../types/user_types";
import supabase from "../utils/supabase";

export const loginWithGoogle = async ({ redirectURL }: { redirectURL: string }) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}#${redirectURL}`
        }
    })
    if (error) console.error("Google auth error:", error);
    return { data, error };
};

export const getUserProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
    if (error) console.error("Unable to retrieve user:", error);
    return { data, error };
};

export const signOut = async () => {
    await supabase.auth.signOut();
};

export const signIn = async ({ email, password }: Credentials) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) console.error("Login error", error);
    return { data, error };
}

export const signUp = async ({ name, email, password }: Credentials) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name
            }
        }
    });
    if (error) {
        console.error("Registration error:", error)
    };
    return { data, error };
}

export const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.href,
    })
    if (error) console.error("Reset error:", error)
    return { error };
}