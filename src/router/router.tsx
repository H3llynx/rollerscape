import { createHashRouter } from "react-router";
import { Layout } from "../components/Layout/Layout";
import { AuthPage } from "../features/auth/AuthPage";
import { MapPage } from "../features/map/MapPage";
import { OnboardingPage } from "../features/profile/OnboardingPage";
import { ProfilePage } from "../features/profile/ProfilePage";
import { ProtectedRoute } from "./ProtectedRoute";

export const Router = createHashRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <MapPage />
            },
            {
                path: "auth",
                element: <AuthPage />
            },
            {
                path: "/onboarding",
                element: (
                    <ProtectedRoute>
                        <OnboardingPage />
                    </ProtectedRoute>)
            },
            {
                path: "/profile",
                element: (
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>)
            },
        ]
    },
])