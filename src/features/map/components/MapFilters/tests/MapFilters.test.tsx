import { render, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from "vitest";
import { makeSpot, valAuthNoUser, valAuthUser } from '../../../../../tests/setup';
import { AuthContext } from '../../../../auth/context/AuthContext';
import { MapPage } from '../../../MapPage';
import { SpotsContext } from '../../../context/SpotsContext';

let mockProfile: any = null;

vi.mock("../../../hooks/useCenter", () => ({
    useCenter: () => ({
        center: [40.4168, -3.7038],
        setCenter: vi.fn(),
        error: null,
        setError: vi.fn(),
        trackUser: vi.fn(),
        profile: mockProfile,
    })
}));

const mockSpots = [
    makeSpot({ id: "1", name: "Spot A", spot_types: [{ id: 1, name: "street_plaza" }] }),
    makeSpot({ id: "2", name: "Spot B", spot_types: [{ id: 2, name: "greenway" }] }),
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

const MapArea = (userContext: any) => (
    <MemoryRouter>
        <AuthContext value={userContext}>
            <SpotsContext value={spotsVal}>
                <MapPage />
            </SpotsContext>
        </AuthContext>
    </MemoryRouter>
)

describe("Filters on loading", () => {
    it("should show all the spot type filters checked by default", () => {
        const { container } = render(MapArea(valAuthNoUser));
        console.log(container.innerHTML)
        const filterContainer = container.querySelector("#spot-type-filters");
        const checkboxes = within(filterContainer as HTMLElement).getAllByRole("checkbox")
        checkboxes.forEach(checkbox => expect(checkbox).toBeChecked());
    });
    it("should prefilter the spots by type preference if the user is logged and has preferences set", async () => {
        mockProfile = valAuthUser.profile;
        const { container } = render(MapArea(valAuthUser));
        const filterContainer = container.querySelector("#spot-type-filters");
        const checkboxes = within(filterContainer as HTMLElement).getAllByRole("checkbox");
        checkboxes.forEach(checkbox => {
            if ((checkbox as HTMLInputElement).value === "greenway")
                expect(checkbox).toBeChecked();
            else expect(checkbox).not.toBeChecked();
        });
    });
});