import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { UserProfile } from "../../../types/user_types";
import { useAuth } from "../../auth/hooks/useAuth";

export function useProfile() {
    const navigate = useNavigate();
    const { loading, profile } = useAuth();

    useEffect(() => {
        if (!loading && !profile) navigate("/auth");
    }, [profile, navigate, loading])

    return { profile: profile as UserProfile, loading };
}