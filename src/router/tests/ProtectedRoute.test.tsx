import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { ProtectedRoute } from "../ProtectedRoute";

vi.mock("../../features/auth/hooks/useAuth");

describe("ProtectedRoute", () => {
    it("should redirect to /auth if user is not authenticated", () => {
        vi.mocked(useAuth).mockReturnValue({ user: null, setUser: () => { }, loading: false, profile: null, setProfile: () => { } });

        render(
            <MemoryRouter initialEntries={['/add-spot']}>
                <Routes>
                    <Route path="/add-spot" element={<ProtectedRoute><div>protected</div></ProtectedRoute>} />
                    <Route path="/auth" element={<div>auth page</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText("auth page")).toBeInTheDocument();
    });

    it("should render the protected route if user is authenticated", () => {
        vi.mocked(useAuth).mockReturnValue({ user: { id: '123' } as any, setUser: () => { }, loading: false, profile: null, setProfile: () => { } });

        render(
            <MemoryRouter>
                <ProtectedRoute><div>Welcome user!</div></ProtectedRoute>
            </MemoryRouter>
        );

        expect(screen.getByText("Welcome user!")).toBeInTheDocument();
    });
});