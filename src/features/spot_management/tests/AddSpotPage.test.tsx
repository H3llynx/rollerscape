import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act, useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from "vitest";
import { spotErrors } from '../../../config/errors';
import { spotFormFields } from '../../../config/spots';
import { redirecttoSpotUrl } from '../../../config/urls';
import { insertDataWithJunctions } from '../../../services/data';
import { fetchRoute } from '../../../services/geolocation';
import { valAuthUser } from '../../../tests/setup';
import type { Coordinates, Route } from '../../../types/geolocation_types';
import type { Spot } from '../../../types/spots_types';
import { AuthContext } from '../../auth/context/AuthContext';
import { PanelSizeProvider } from '../../map/context/PanelSize/PanelSizeProvider';
import { SpotsContext } from '../../map/context/Spots/SpotsContext';
import { AddSpotPage } from '../AddSpotPage';
import { AddSpotMap } from '../components/AddSpotMap/AddSpotMap';
import { SpotForm } from '../components/SpotForm/SpotForm';

window.HTMLElement.prototype.scrollIntoView = vi.fn();

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

const spotsVal = {
    spots: [],
    setSpots: () => { },
    loading: false,
    error: null,
    loadSpots: () => Promise.resolve(),
    selectedSpot: null,
    setSelectedSpot: () => { },
}

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
    useMap: vi.fn(() => ({ flyTo: vi.fn(), setView: vi.fn(), getZoom: vi.fn(), invalidateSize: vi.fn() })),
    useMapEvents: vi.fn(() => null),
}));

vi.mock('../../map/components/MapBase/MapBase', () => ({
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

vi.mock('../../map/components/RouteDisplay/RouteDisplay', () => ({
    RouteDisplay: ({ data }: any) => (
        <div data-testid="route-display" data-coords={JSON.stringify(data)} />
    ),
}));

vi.mock('../components/AddMarker/AddMarker', () => ({
    AddMarker: () => <div data-testid={"add-marker"} />
}));

vi.mock('../../map/components/UserMarker/UserMarker', () => ({
    UserMarker: () => null,
}));

vi.mock('../../map/components/FlyToUser/FlyToUser', () => ({
    FlyToUser: () => null,
}));

vi.mock('../../../services/geolocation', () => ({
    fetchRoute: vi.fn(),
    reverseGeocode: vi.fn().mockResolvedValue({ city: "Barcelona", country: "es", name: "B-10, Sant Martí, 08019 Barcelona" }),
}));

vi.mock('../../../services/data', () => ({
    insertDataWithJunctions: vi.fn().mockResolvedValue({ error: null }),
}))

const mockNavigate = vi.fn();

vi.mock("react-router", async () => {
    const actual = await vi.importActual('react-router');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

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

let capturedHandler: any = null;

const simulateClick = async (lat: number, lng: number) => {
    await act(async () => {
        capturedHandler.click({ latlng: { lat, lng } });
    });
};
const user = userEvent.setup();

describe("Step 1: init with location type confirmation", () => {
    it("should first asks the user to confirm the location type before they can go any further", async () => {
        render(<MapArea />);
        expect(screen.getByLabelText(spotFormFields.location_type.label)).toBeInTheDocument();
        expect(screen.queryByLabelText(/add spot/i)).not.toBeInTheDocument();
    });
    it("should show the spot detail form and map once the location type is selected", async () => {
        render(<MapArea />);
        await user.selectOptions(screen.getByLabelText(/pick a location type/i), "point");
        await user.click(screen.getByRole("button", { name: /confirm/i }));
        expect(screen.getByLabelText(/add spot/i)).toBeInTheDocument();
        expect(screen.getByTestId("map")).toBeInTheDocument();
    })
    it("should show the spot detail form and map once the location type is selected", async () => {
        render(<MapArea />);
        await user.selectOptions(screen.getByLabelText(/pick a location type/i), "point");
        await user.click(screen.getByRole("button", { name: /confirm/i }));
        expect(screen.getByLabelText(/add spot/i)).toBeInTheDocument();
        expect(screen.getByTestId("map")).toBeInTheDocument();
    })
});

describe("Step 2: coordinates picking on map", () => {
    const MockAddSpotMap = ({ locationType = "point", custom = false }: { locationType?: Spot["location_type"], custom?: boolean }) => {
        const [spotCoordinates, setSpotCoordinates] = useState<Coordinates[]>([]);
        const [routes, setRoutes] = useState<Route[]>([]);
        return (
            <PanelSizeProvider>
                <AddSpotMap
                    locationType={locationType}
                    confirmedLocationType={true}
                    spotCoordinates={spotCoordinates}
                    setSpotCoordinates={setSpotCoordinates}
                    routes={routes}
                    setRoutes={setRoutes}
                    selectedRoute={0}
                    setSelectedRoute={vi.fn()}
                    gpxCoordinates={null}
                    custom={custom}
                    setCustom={vi.fn()}
                    customDistanceRef={{ current: 0 }}
                />
            </PanelSizeProvider>
        )
    };
    vi.mocked(useMapEvents).mockImplementation((handlers: any) => {
        capturedHandler = handlers;
        return null as any;
    });
    it("location type: point -> when the user clicks on the map, should show a marker at the clicked coordinates", async () => {
        render(<MockAddSpotMap />);
        await simulateClick(40.4168, -3.7038);
        expect(screen.getByTestId("add-marker")).toBeInTheDocument();
    });
    it("location type: route -> when the user picks the start point, should show a marker at the clicked coordinates", async () => {
        render(<MockAddSpotMap locationType="route" />);
        await simulateClick(40.4168, -3.7038);
        expect(screen.getByTestId("add-marker")).toBeInTheDocument();
    });
    it("location type: route -> when the user picks the start and point, should show the osmr route suggestions", async () => {
        vi.mocked(fetchRoute).mockResolvedValue([{
            geometry: { coordinates: [[40.4168, -3.7038], [40.4170, -3.7028]] },
            distance: 100,
        }] as any);
        render(<MockAddSpotMap locationType="route" />);
        await simulateClick(40.4168, -3.7038);
        await simulateClick(40.4170, -3.7028);
        await waitFor(() => expect(screen.getByTestId("route-display")).toBeInTheDocument());
    });
    it("location type: route -> when the user draw a custom itinerary, should show it on the map", async () => {
        render(<MockAddSpotMap locationType="route" custom />);
        await simulateClick(40.4168, -3.7038);
        await simulateClick(40.4170, -3.7028);
        await waitFor(() => expect(screen.getByTestId("route-display")).toBeInTheDocument());
    });
});

describe("Step 3: form", () => {
    const MockSpotForm = ({ spotCoordinates = null }: { spotCoordinates?: Coordinates[] | null }) => (
        <SpotsContext value={spotsVal}>
            <SpotForm
                isAdding={true}
                spotCoordinates={spotCoordinates}
                onSubmit={vi.fn()}
            />
        </SpotsContext>);
    it("should block the submission if the name and/or the surface quality are missing", async () => {
        render(<MockSpotForm />);
        await user.click(screen.getByRole("button", { name: /add spot/i }));
        expect(screen.getByRole("textbox", { name: spotFormFields.name.label })).toBeInvalid();
        expect(document.getElementById(spotFormFields.surface_quality.id)).toBeInvalid();
    });
    it("will show an error message if the spot type and the traffic level are not provided", async () => {
        render(<MockSpotForm />);
        await user.type(screen.getByLabelText(spotFormFields.name.label), "Forum");
        fireEvent.change(screen.getByLabelText(spotFormFields.surface_quality.label), {
            target: { value: 4 }
        });
        await user.click(screen.getByRole("button", { name: /add spot/i }));
        expect(screen.getByText(spotErrors.add.missing_spot_type)).toBeInTheDocument();
        expect(screen.getByText(spotErrors.add.missing_traffic_level)).toBeInTheDocument();
    });
});

describe("Spot submission overall", () => {
    it("should show an error if coordinates are missing", async () => {
        render(<MapArea />);
        await user.selectOptions(screen.getByLabelText(/pick a location type/i), "point");
        await user.click(screen.getByRole("button", { name: /confirm/i }));
        await user.type(screen.getByLabelText(spotFormFields.name.label), "Forum");
        fireEvent.change(screen.getByLabelText(spotFormFields.surface_quality.label), { target: { value: 4 } });
        await user.click(screen.getByLabelText("Skatepark"));
        await user.click(screen.getByLabelText("Always quiet"));
        await user.click(screen.getByRole("button", { name: /add spot/i }));
        await waitFor(() => {
            expect(screen.getByText(spotErrors.add.missing_coordinates)).toBeInTheDocument();
        });
    });
    it("should add the spot to the database on submit and redirect the user to the map with the new spot description open if all the requested fields are provided", async () => {
        render(<MapArea />);
        await user.selectOptions(screen.getByLabelText(/pick a location type/i), "point");
        await user.click(screen.getByRole("button", { name: /confirm/i }));
        await simulateClick(40.4168, -3.7038);
        await user.type(screen.getByLabelText(spotFormFields.name.label), "Forum");
        fireEvent.change(screen.getByLabelText(spotFormFields.surface_quality.label), { target: { value: 4 } });
        await user.click(screen.getByLabelText("Skatepark"));
        await user.click(screen.getByLabelText("Always quiet"));
        await user.click(screen.getByRole("button", { name: /add spot/i }));
        await waitFor(() => {
            expect(vi.mocked(insertDataWithJunctions)).toHaveBeenCalled();
        });
        expect(mockNavigate).toHaveBeenCalledWith(
            redirecttoSpotUrl("forum-barcelona")
        );
    })
})