import { RouterProvider } from "react-router";
import { AuthProvider } from "./features/auth/context/AuthProvider";
import { SpotsProvider } from "./features/map/context/SpotsProvider";
import { Router } from "./router/router";

function App() {

    return (
        <AuthProvider>
            <SpotsProvider>
                <RouterProvider router={Router} />
            </SpotsProvider>
        </AuthProvider>
    )
}

export default App