import { RouterProvider } from "react-router";
import { AuthProvider } from "./features/auth/context/AuthProvider";
import { PanelSizeProvider } from "./features/map/context/PanelSizeProvider";
import { SpotsProvider } from "./features/map/context/SpotsProvider";
import { Router } from "./router/router";

function App() {

    return (
        <AuthProvider>
            <SpotsProvider>
                <PanelSizeProvider>
                    <RouterProvider router={Router} />
                </PanelSizeProvider>
            </SpotsProvider>
        </AuthProvider>
    )
}

export default App