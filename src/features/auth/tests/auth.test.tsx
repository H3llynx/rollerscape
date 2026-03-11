import { act, render, screen, within } from '@testing-library/react';
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from "vitest";
import { signIn } from '../../../services/auth';
import { mockNavigate, valAuthNoUser, valAuthUser } from '../../../tests/setup';
import { PanelSizeProvider } from '../../map/context/PanelSize/PanelSizeProvider';
import { SpotsProvider } from '../../map/context/Spots/SpotsProvider';
import { MapPage } from '../../map/MapPage';
import { AuthPage } from "../AuthPage";
import { AuthContext } from '../context/AuthContext';

const AuthArea = (userContext: any) => (
    <MemoryRouter>
        <AuthContext value={userContext}>
            <SpotsProvider>
                <AuthPage />
            </SpotsProvider>
        </AuthContext>
    </MemoryRouter>
)

describe("Authentication process", () => {
    it("should display a popup if the user fails registration", async () => {
        const user = userEvent.setup()
        vi.mocked(signIn).mockResolvedValueOnce(
            { data: null, error: { message: "Invalid credentials", status: 400 } } as any
        )
        render(AuthArea(valAuthNoUser));
        const form = within(screen.getByRole("main")).getByRole("form");
        await user.type(within(form).getByLabelText(/email address/i), "test@test.com");
        await user.type(within(form).getByLabelText(/password/i), "wrongpassword");
        await user.click(within(form).getByRole("button", { name: /log in/i }));
        expect(screen.getByRole("dialog", { hidden: true })).toHaveAttribute("open");
    })

    it("should redirect the user to the homepage if the user logs in correctly", async () => {
        vi.mocked(signIn).mockResolvedValueOnce(
            { data: { user: { id: "123" }, session: null }, error: null } as any
        );
        await act(async () => { render(AuthArea(valAuthUser)) });
        expect(mockNavigate).toHaveBeenCalled();
    });

    it("should display the user name in the homepage if the user is logged", async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <AuthContext value={valAuthUser as any}>
                        <SpotsProvider>
                            <PanelSizeProvider>
                                <MapPage />
                            </PanelSizeProvider>
                        </SpotsProvider>
                    </AuthContext>
                </MemoryRouter>
            )
        });
        expect(screen.getByText(/Helene/i)).toBeInTheDocument();
    });
});