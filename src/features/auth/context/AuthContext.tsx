import type { User } from "@supabase/supabase-js";
import { createContext, type Dispatch, type SetStateAction } from "react";
import type { UserProfile } from "../../../types/user_types";

type AuthContext = {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
    profile: UserProfile | null;
    setProfile: Dispatch<SetStateAction<UserProfile | null>>;
    loading: boolean;
}

export const AuthContext = createContext<AuthContext | null>(null);