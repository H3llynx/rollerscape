import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { Loading } from "../components/Loading/Loading";
import { useAuth } from "../features/auth/hooks/useAuth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();
    if (loading) return (
        <Loading />
    )
    if (!user) return (
        <Navigate to="/auth" />
    )
    else return (
        <> {children} </>
    )
}