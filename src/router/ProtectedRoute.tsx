import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../features/auth/hooks/useAuth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();
    if (loading) return
    if (!user) return (
        <Navigate to="/auth" />
    )
    else return (
        <> {children} </>
    )
}