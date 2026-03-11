import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeSpot, spotsVal, valAuthNoUser, valAuthUser } from '../../../tests/setup';
import { AuthContext } from '../../auth/context/AuthContext';
import { PanelSizeProvider } from '../context/PanelSize/PanelSizeProvider';
import { SpotsContext } from '../context/Spots/SpotsContext';
import { useCenter } from '../hooks/useCenter';
import { MapPage } from '../MapPage';

vi.mock("../hooks/useCenter", () => ({
    useCenter: vi.fn(),
}));

const routeSpot = makeSpot({ id: "1", name: "Spot A", location_type: "point", spot_types: [{ id: "1", name: "street_plaza" }] });
const pointSpots = [
    makeSpot({ id: "2", name: "Spot B", location_type: "route", spot_types: [{ id: "2", name: "greenway" }] }),
    makeSpot({ id: "3", name: "Spot C", location_type: "route", spot_types: [{ id: "3", name: "bike_path" }] })
];

const MapArea = (authContext: any, spotContext: any) => (
    <MemoryRouter>
        <AuthContext value={authContext}>
            <SpotsContext value={spotContext}>
                <PanelSizeProvider>
                    <MapPage />
                </PanelSizeProvider>
            </SpotsContext>
        </AuthContext>
    </MemoryRouter>
);

let spotsValue = { ...spotsVal, spots: [routeSpot, ...pointSpots] }

describe("Map display", () => {
    it("should display the map once a has allowed geolocation", () => {
        vi.mocked(useCenter).mockReturnValue({
            center: [40.4168, -3.7038],
            setCenter: vi.fn(),
            error: null,
            setError: vi.fn(),
            trackUser: vi.fn(),
            profile: null,
        } as any);
        render(MapArea(valAuthNoUser, spotsValue))
        expect(screen.getByTestId("map")).toBeInTheDocument();
    });
    it("should open an error popup if the user did not allow geolocation", async () => {
        vi.mocked(useCenter).mockReturnValue({
            center: [40.4168, -3.7038],
            setCenter: vi.fn(),
            error: "error",
            setError: vi.fn(),
            trackUser: vi.fn(),
            profile: valAuthUser.profile,
        } as any);
        render(MapArea(valAuthNoUser, spotsValue));
        expect(screen.getByRole("dialog", { hidden: true })).toHaveAttribute("open");
    });
});

describe("Spot display", () => {
    beforeEach(() => {
        vi.mocked(useCenter).mockReturnValue({
            center: [40.4168, -3.7038],
            setCenter: vi.fn(),
            error: null,
            setError: vi.fn(),
            trackUser: vi.fn(),
            profile: valAuthNoUser.profile,
        } as any);
    });
    it("shows the loading animation while spots are being fetched", () => {
        render(MapArea(valAuthNoUser, { ...spotsValue, loading: true }));
        expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
    });
    it("shows a marker for each spot of type 'point'", () => {
        render(MapArea(valAuthNoUser, spotsValue));
        expect(screen.getByTestId("marker-1")).toBeInTheDocument();
    });
    it("shows two markers for each spot of type 'route'", () => {
        render(MapArea(valAuthNoUser, spotsValue));
        expect(screen.getAllByTestId(/marker-2/)).toHaveLength(2);
    });
    it("Shows the itinerary (polyline) when a spot of type `route`is selected", () => {
        spotsValue = { ...spotsValue, selectedSpot: routeSpot as any };
        render(MapArea(valAuthNoUser, spotsValue));
        expect(screen.getByTestId("route-display")).toBeInTheDocument();
    });
    it("Hides the polyline when the route is unclicked / unselected", () => {
        spotsValue = { ...spotsValue, selectedSpot: null };
        render(MapArea(valAuthNoUser, spotsValue));
        expect(screen.queryByTestId("route-display")).not.toBeInTheDocument();
    });
});

describe("Filters behaviour", () => {
    it("Should show all the spot type filters checked by default when the user has no profile", () => {
        vi.mocked(useCenter).mockReturnValue({
            center: [40.4168, -3.7038],
            setCenter: vi.fn(),
            error: null,
            setError: vi.fn(),
            trackUser: vi.fn(),
            profile: valAuthNoUser.profile,
        } as any);
        const { container } = render(MapArea(valAuthNoUser, spotsValue));
        const filterContainer = container.querySelector("#spot-type-filters");
        const checkboxes = within(filterContainer as HTMLElement).getAllByRole("checkbox")
        checkboxes.forEach(checkbox => expect(checkbox).toBeChecked());
    });
    it("otherwise, should prefilter the spots accorder to the user's preferences", async () => {
        vi.mocked(useCenter).mockReturnValue({
            center: [40.4168, -3.7038],
            setCenter: vi.fn(),
            error: null,
            setError: vi.fn(),
            trackUser: vi.fn(),
            profile: valAuthUser.profile,
        } as any);
        const { container } = render(MapArea(valAuthUser, spotsValue));
        const filterContainer = container.querySelector("#spot-type-filters");
        const checkboxes = within(filterContainer as HTMLElement).getAllByRole("checkbox");
        checkboxes.forEach(checkbox => {
            if ((checkbox as HTMLInputElement).value === valAuthUser.profile.preferred_spot_types[0].name || (checkbox as HTMLInputElement).value === valAuthUser.profile.preferred_spot_types[1].name)
                expect(checkbox).toBeChecked();
            else expect(checkbox).not.toBeChecked();
        });
        expect(screen.queryAllByTestId("marker-2")).toHaveLength(2);
        expect(screen.queryAllByTestId("marker-3")).toHaveLength(2);
        expect(screen.queryByTestId("marker-1")).not.toBeInTheDocument();
    });
    it("should only show the user's favorite spots if the user checks favorite", async () => {
        vi.mocked(useCenter).mockReturnValue({
            center: [40.4168, -3.7038],
            setCenter: vi.fn(),
            error: null,
            setError: vi.fn(),
            trackUser: vi.fn(),
            profile: valAuthUser.profile,
        } as any);
        const user = userEvent.setup()
        const { container } = render(MapArea(valAuthUser, spotsValue));
        const filterContainer = container.querySelector("#spot-type-filters");
        await user.click(within(filterContainer as HTMLElement).getByRole("checkbox", { name: /Favorite Spots/i }));
        expect(screen.queryAllByTestId("marker-2")).toHaveLength(2);
        expect(screen.queryAllByTestId("marker-3")).toHaveLength(0);
        expect(screen.queryByTestId("marker-1")).not.toBeInTheDocument();
    });
    it("should only show spots of the type selected by the user", async () => {
        vi.mocked(useCenter).mockReturnValue({
            center: [40.4168, -3.7038],
            setCenter: vi.fn(),
            error: null,
            setError: vi.fn(),
            trackUser: vi.fn(),
            profile: valAuthNoUser.profile,
        } as any);
        const user = userEvent.setup()
        const { container } = render(MapArea(valAuthNoUser, spotsValue));
        const filterContainer = container.querySelector("#spot-type-filters");
        await user.click(within(filterContainer as HTMLElement).getByRole("checkbox", { name: /Clear all/i }));
        await user.click(within(filterContainer as HTMLElement).getByRole("checkbox", { name: /Street & Plaza/i }));
        expect(screen.queryAllByTestId("marker-2")).toHaveLength(0);
        expect(screen.queryAllByTestId("marker-3")).toHaveLength(0);
        expect(screen.queryByTestId("marker-1")).toBeInTheDocument();
    });
});

describe("Left panel behavior", () => {
    beforeEach(() => {
        vi.mocked(useCenter).mockReturnValue({
            center: [40.4168, -3.7038],
            setCenter: vi.fn(),
            error: null,
            setError: vi.fn(),
            trackUser: vi.fn(),
            profile: valAuthNoUser.profile,
        } as any);
    });
    it("should be collapsed if no spot is selected", () => {
        render(MapArea(valAuthNoUser, spotsValue));
        const container = document.querySelector(".full-width-container");
        expect(container).toHaveClass("collapsed");
    });
    it("else, should be displayed", () => {
        render(MapArea(valAuthNoUser, { ...spotsValue, selectedSpot: routeSpot }));
        const container = document.querySelector(".full-width-container");
        expect(container).toHaveClass("expanded");
    });
    it("when displayed, should contain the selected spot information", () => {
        render(MapArea(valAuthNoUser, { ...spotsValue, selectedSpot: routeSpot }));
        const container = document.querySelector(".full-width-container");
        expect(within(container as HTMLElement).getByText("Spot A")).toBeInTheDocument();
    });
});