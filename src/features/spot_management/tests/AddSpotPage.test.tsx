import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { expect, it, vi } from "vitest";
import { spotFormFields } from '../../../config/spots';
import { makeSpot, valAuthUser } from '../../../tests/setup';
import { AuthContext } from '../../auth/context/AuthContext';
import { PanelSizeProvider } from '../../map/context/PanelSize/PanelSizeProvider';
import { SpotsContext } from '../../map/context/Spots/SpotsContext';
import { AddSpotPage } from '../AddSpotPage';

vi.mock("../../map/hooks/useCenter", () => ({
    useCenter: () => ({
        center: [40.4168, -3.7038],
        setCenter: vi.fn(),
        error: null,
        setError: vi.fn(),
        trackUser: vi.fn(),
        profile: valAuthUser.profile,
    })
}));

const mockSpots = [
    makeSpot({ id: "1", name: "Spot A", spot_types: [{ id: "1", name: "street_plaza" }], created_by: "1" }),
    makeSpot({ id: "2", name: "Spot B", spot_types: [{ id: "2", name: "greenway" }] }),
];

const spotsVal = {
    spots: mockSpots,
    setSpots: () => { },
    loading: false,
    error: null,
    loadSpots: () => Promise.resolve(),
    selectedSpot: null,
    setSelectedSpot: () => { },
}

const MapArea = () => (
    <MemoryRouter>
        <AuthContext value={valAuthUser as any} >
            <SpotsContext value={spotsVal}>
                <PanelSizeProvider>
                    <AddSpotPage />
                </PanelSizeProvider>
            </SpotsContext>
        </AuthContext>
    </MemoryRouter>
);

const mockCoords = [{ lat: 48.00001, lon: -2.00001 }];

vi.mock('../../../../services/db', () => ({
    insertDataWithJunctions: vi.fn().mockResolvedValue({ error: null }),
    getSpotTypes: vi.fn().mockResolvedValue({ data: [{ id: '1' }] }),
    getTrafficLevels: vi.fn().mockResolvedValue({ data: [{ id: '2' }] }),
}))

it("first asks user to pick a location type, then display the form", async () => {
    const user = userEvent.setup()
    render(<MapArea />)

    await user.selectOptions(screen.getByLabelText(/pick a location type/i), "point")
    await user.click(screen.getByRole("button", { name: /confirm/i }))

    await waitFor(() => {
        expect(screen.getByLabelText(spotFormFields.name.label)).toBeInTheDocument()
    });
});