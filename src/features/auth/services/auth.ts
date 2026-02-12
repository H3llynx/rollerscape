import supabase from "../../../utils/supabase";

export const loginWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google"
    })
    if (error) {
        console.error(`Google auth error: ${error}`);
    }
    return { data, error };
};

export const getUserProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
    if (error) {
        console.error(`unable to retrieve user name: ${error}`);
    }
    return data;
};

export const logOut = async () => {
    await supabase.auth.signOut();
};