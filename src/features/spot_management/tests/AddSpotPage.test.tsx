import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from "vitest";
import { spotFormFields } from '../../../config/spots';
import { valAuthUser } from '../../../tests/setup';
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

const spotsVal = {
    spots: [],
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
    RouteDisplay: ({ data, selected }: any) => (
        selected
            ? <div data-testid="route-display" data-coords={JSON.stringify(data)} />
            : null
    ),
}));

vi.mock('../../map/components/AddtMarker/AddMarker', () => ({
    SpotMarker: ({ spot }: any) => <div data-testid={`marker-${spot.id}`} />
}));

vi.mock('../../map/components/UserMarker/UserMarker', () => ({
    UserMarker: () => null,
}));

vi.mock('../../map/components/FlyToUser/FlyToUser', () => ({
    FlyToUser: () => null,
}));

vi.mock('../../../../services/db', () => ({
    insertDataWithJunctions: vi.fn().mockResolvedValue({ error: null }),
    getSpotTypes: vi.fn().mockResolvedValue({ data: [{ id: '1' }] }),
    getTrafficLevels: vi.fn().mockResolvedValue({ data: [{ id: '2' }] }),
}))

const mockCoords = [{ lat: 48.00001, lon: -2.00001 }];

describe("Spot addition process", () => {
    it("should first asks the user to confirm the location type before they can go any further", async () => {
        render(<MapArea />);
        expect(screen.getByLabelText(spotFormFields.location_type.label)).toBeInTheDocument();
        expect(screen.queryByLabelText(/add spot/i)).not.toBeInTheDocument();
    });
    it("should show the spot detail form and map once the location type is selected", async () => {
        const user = userEvent.setup();
        render(<MapArea />);
        await user.selectOptions(screen.getByLabelText(/pick a location type/i), "point");
        await user.click(screen.getByRole("button", { name: /confirm/i }));
        expect(screen.getByLabelText(/add spot/i)).toBeInTheDocument();
        expect(screen.getByTestId("map")).toBeInTheDocument();
    })
});