import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeSpot, valAuthNoUser, valAuthUser } from '../../../tests/setup';
import { AuthContext } from '../../auth/context/AuthContext';
import { PanelSizeProvider } from '../context/PanelSize/PanelSizeProvider';
import { SpotsContext } from '../context/Spots/SpotsContext';
import { useCenter } from '../hooks/useCenter';
import { MapPage } from '../MapPage';

vi.mock("../hooks/useCenter", () => ({
    useCenter: vi.fn(),
}));

vi.mock('react-leaflet', () => ({
    LayerGroup: ({ children }: any) => <div data-testid="layer-group">{children}</div>,
    MapContainer: ({ children }: any) => <div data-testid="map-container">{children}</div>,
    LayersControl: () => null,
    ZoomControl: () => null,
    TileLayer: () => null,
    Marker: () => null,
    Polyline: ({ positions }: any) => (
        <div data-testid="polyline" data-positions={JSON.stringify(positions)} />
    ),
    useMap: vi.fn(() => ({ flyTo: vi.fn(), setView: vi.fn() })),
    useMapEvents: vi.fn(() => null),
}));

vi.mock('../components/MapBase/MapBase', () => ({
    MapBase: ({ children, other }: any) => (
        <div data-testid="map">
            {other}
            {children}
        </div>
    ),
}));

vi.mock('react-leaflet-custom-control', () => ({
    default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('../components/RouteDisplay/RouteDisplay', () => ({
    RouteDisplay: ({ data, selected }: any) => (
        selected
            ? <div data-testid="route-display" data-coords={JSON.stringify(data)} />
            : null
    ),
}));

vi.mock('../components/SpotMarker/SpotMarker', () => ({
    SpotMarker: ({ spot }: any) => <div data-testid={`marker-${spot.id}`} />
}));

vi.mock('../components/UserMarker/UserMarker', () => ({
    UserMarker: () => null,
}));

vi.mock('../components/FlyToUser/FlyToUser', () => ({
    FlyToUser: () => null,
}));

vi.mock('../components/FlyToSpot/FlyToSpot', () => ({
    FlyToSpot: () => null,
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

let spotsVal = {
    spots: [routeSpot, ...pointSpots],
    setSpots: () => { },
    loading: false,
    error: null,
    loadSpots: () => Promise.resolve(),
    selectedSpot: null,
    setSelectedSpot: () => { },
}

describe("Map display", () => {
    it("should display the spots once user is logged", () => {
        vi.mocked(useCenter).mockReturnValue({
            center: [40.4168, -3.7038],
            setCenter: vi.fn(),
            error: null,
            setError: vi.fn(),
            trackUser: vi.fn(),
            profile: valAuthUser.profile,
        } as any);
        render(MapArea(valAuthUser, spotsVal))
        expect(screen.getByTestId("map")).toBeInTheDocument();
    });
    it("should also display the spots if user is not logged but has allowed", () => {
        vi.mocked(useCenter).mockReturnValue({
            center: [40.4168, -3.7038],
            setCenter: vi.fn(),
            error: null,
            setError: vi.fn(),
            trackUser: vi.fn(),
            profile: null,
        } as any);
        render(MapArea(valAuthNoUser, spotsVal))
        expect(screen.getByTestId("map")).toBeInTheDocument();
    });
    it("should open an error popup otherwise", async () => {
        vi.mocked(useCenter).mockReturnValue({
            center: [40.4168, -3.7038],
            setCenter: vi.fn(),
            error: "error",
            setError: vi.fn(),
            trackUser: vi.fn(),
            profile: valAuthUser.profile,
        } as any);
        render(MapArea(valAuthNoUser, spotsVal));
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
        render(MapArea(valAuthNoUser, { ...spotsVal, loading: true }));
        expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
    });
    it("shows a marker for each spot of type 'point'", () => {
        render(MapArea(valAuthNoUser, spotsVal));
        expect(screen.getByTestId("marker-1")).toBeInTheDocument();
    });
    it("shows two markers for each spot of type 'route'", () => {
        render(MapArea(valAuthNoUser, spotsVal));
        expect(screen.getAllByTestId(/marker-2/)).toHaveLength(2);
    });
    it("Shows the itinerary (polyline) when a spote of type `route`is selected", () => {
        spotsVal = { ...spotsVal, selectedSpot: routeSpot as any };
        render(MapArea(valAuthNoUser, spotsVal));
        expect(screen.getByTestId("route-display")).toBeInTheDocument();
    });
    it("Hides the polyline when the route is unclicked / unselected", () => {
        spotsVal = { ...spotsVal, selectedSpot: null };
        render(MapArea(valAuthNoUser, spotsVal));
        expect(screen.queryByTestId("route-display")).not.toBeInTheDocument();
    });
});

describe("Filters behaviour", () => {
    it("on loading, should show all the spot type filters checked by default", () => {
        vi.mocked(useCenter).mockReturnValue({
            center: [40.4168, -3.7038],
            setCenter: vi.fn(),
            error: null,
            setError: vi.fn(),
            trackUser: vi.fn(),
            profile: valAuthNoUser.profile,
        } as any);
        const { container } = render(MapArea(valAuthNoUser, spotsVal));
        const filterContainer = container.querySelector("#spot-type-filters");
        const checkboxes = within(filterContainer as HTMLElement).getAllByRole("checkbox")
        checkboxes.forEach(checkbox => expect(checkbox).toBeChecked());
    });
    it("on loading, should prefilter the spots by type preference if the user is logged and has preferences set", async () => {
        vi.mocked(useCenter).mockReturnValue({
            center: [40.4168, -3.7038],
            setCenter: vi.fn(),
            error: null,
            setError: vi.fn(),
            trackUser: vi.fn(),
            profile: valAuthUser.profile,
        } as any);
        const { container } = render(MapArea(valAuthUser, spotsVal));
        const filterContainer = container.querySelector("#spot-type-filters");
        const checkboxes = within(filterContainer as HTMLElement).getAllByRole("checkbox");
        checkboxes.forEach(checkbox => {
            if ((checkbox as HTMLInputElement).value === valAuthUser.profile.preferred_spot_types[0] || (checkbox as HTMLInputElement).value === valAuthUser.profile.preferred_spot_types[1])
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
        const { container } = render(MapArea(valAuthUser, spotsVal));
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
        const { container } = render(MapArea(valAuthNoUser, spotsVal));
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
        render(MapArea(valAuthNoUser, spotsVal));
        const container = document.querySelector(".full-width-container");
        expect(container).toHaveClass("collapsed");
    });
    it("else, should be displayed", () => {
        render(MapArea(valAuthNoUser, { ...spotsVal, selectedSpot: routeSpot }));
        const container = document.querySelector(".full-width-container");
        expect(container).toHaveClass("expanded");
    });
    it("when displayed, should contain the selected spot information", () => {
        render(MapArea(valAuthNoUser, { ...spotsVal, selectedSpot: routeSpot }));
        const container = document.querySelector(".full-width-container");
        expect(within(container as HTMLElement).getByText("Spot A")).toBeInTheDocument();
    });
});