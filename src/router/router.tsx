import { createHashRouter } from "react-router";
import { Layout } from "../components/Layout/Layout";
import { AuthPage } from "../pages/AuthPage";
import { EventPage } from "../pages/EventPage";
import { HomePage } from "../pages/HomePage";
import { ProfilePage } from "../pages/ProfilePage";
import { ProtectedRoute } from "./ProtectedRoute";

export const Router = createHashRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: "auth",
                element: <AuthPage />
            },
            {
                path: "/profile",
                element: (
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>)
            },
            {
                path: "/events",
                element: (
                    <ProtectedRoute>
                        <EventPage />
                    </ProtectedRoute>)
            },
        ]
    },
])