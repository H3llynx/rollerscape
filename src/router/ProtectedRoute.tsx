import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../features/auth/hooks/useAuth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return;

    if (!user) return (
        <Navigate to="/auth" state={{ from: location }} />
    );

    else return (
        <> {children} </>
    )
}