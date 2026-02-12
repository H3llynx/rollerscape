import { RouterProvider } from "react-router";
import { AuthProvider } from "./features/auth/context/AuthProvider";
import { Router } from "./router/router";

function App() {

    return (
        <AuthProvider>
            <RouterProvider router={Router} />
        </AuthProvider>
    )
}

export default App