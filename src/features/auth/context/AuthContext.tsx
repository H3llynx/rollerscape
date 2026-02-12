import type { User } from "@supabase/supabase-js";
import { createContext } from "react";
import type { UserProfile } from "../types";

type AuthContext = {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
}

export const AuthContext = createContext<AuthContext | null>(null);