import type { User } from "@supabase/supabase-js";
import { useEffect, useState, type ReactNode } from "react";
import supabase from "../../../utils/supabase";
import { getUserProfile } from "../services/auth";
import type { UserProfile } from "../types";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    const setUserAndProfile = async (loggedUser: User | null) => {
        setUser(loggedUser);
        if (loggedUser) {
            const userProfile = await getUserProfile(loggedUser.id);
            setProfile(userProfile);
        } else setProfile(null);
        setLoading(false);
    };

    useEffect(() => {
        const trackUser = supabase.auth.onAuthStateChange((_event, session) => {
            const loggedUser = session ? session.user : null
            setUserAndProfile(loggedUser);
        });
        const subscription = trackUser.data.subscription;
        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext value={{ user, profile, loading }}>
            {children}
        </AuthContext>
    )
}