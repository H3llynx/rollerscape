import { createHashRouter } from "react-router";
import { Layout } from "../components/Layout/Layout";
import { HomePage } from "../pages/HomePage";

export const Router = createHashRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
        ]
    },
])