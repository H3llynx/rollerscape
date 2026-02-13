import { createHashRouter } from "react-router";
import { Layout } from "../components/Layout/Layout";
import { AuthPage } from "../pages/AuthPage";
import { HomePage } from "../pages/HomePage";
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
                path: "/events",
                element: (
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>)
            },
        ]
    },
])