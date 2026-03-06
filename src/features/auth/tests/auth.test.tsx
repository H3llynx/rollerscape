import { render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from "vitest";
import { signIn } from '../../../services/auth';
import { valAuthNoUser, valAuthUser } from '../../../tests/setup';
import { PanelSizeProvider } from '../../map/context/PanelSize/PanelSizeProvider';
import { SpotsProvider } from '../../map/context/Spots/SpotsProvider';
import { MapPage } from '../../map/MapPage';
import { AuthPage } from "../AuthPage";
import { AuthContext } from '../context/AuthContext';

vi.mock("../../../services/auth", () => ({
    signIn: vi.fn(),
    loginWithGoogle: vi.fn(),
}));

const mockNavigate = vi.fn();

vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe("Authentication process", () => {
    const user = userEvent.setup()

    it("should display a popup if the user fails registration", async () => {
        vi.mocked(signIn).mockResolvedValueOnce(
            { data: null, error: { message: "Invalid credentials", status: 400 } } as any
        )
        render(
            <MemoryRouter>
                <AuthContext value={valAuthNoUser}>
                    <AuthPage />
                </AuthContext>
            </MemoryRouter>
        )

        const form = document.querySelector("form")!
        await user.type(within(form).getByLabelText(/email address/i), "test@test.com")
        await user.type(within(form).getByLabelText(/password/i), "wrongpassword")
        await user.click(within(form).getByRole("button", { name: /log in/i }))

        await waitFor(() => {
            expect(screen.getByRole("dialog", { hidden: true })).toHaveAttribute("open")
        })
    })

    it("should redirect the user to the homepage if the user logs in correctly", async () => {
        vi.mocked(signIn).mockResolvedValueOnce(
            { data: { user: { id: "123" }, session: null }, error: null } as any
        );
        render(
            <MemoryRouter>
                <AuthContext value={valAuthUser as any}>
                    <AuthPage />
                </AuthContext>
            </MemoryRouter>
        );
        const form = document.querySelector("form")!
        await user.type(within(form).getByLabelText(/email address/i), "test@test.com")
        await user.type(within(form).getByLabelText(/password/i), "wrongpassword")
        await user.click(within(form).getByRole("button", { name: /log in/i }))

        expect(mockNavigate).toHaveBeenCalled();
    });

    it("should display the user name in the homepage if the user is logged", () => {
        const profile = {
            id: "123",
            name: "Sasha",
            home_country_code: "es",
        };
        render(
            <MemoryRouter>
                <AuthContext value={{ ...valAuthUser, profile } as any}>
                    <SpotsProvider>
                        <PanelSizeProvider>
                            <MapPage />
                        </PanelSizeProvider>
                    </SpotsProvider>
                </AuthContext>
            </MemoryRouter>
        );
        expect(screen.getByText(/Sasha/i)).toBeInTheDocument();
    });
});