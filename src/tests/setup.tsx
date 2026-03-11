import '@testing-library/jest-dom';
import { vi } from 'vitest';
import type { SpotFullInfo } from '../types/spots_types';

export const valAuthNoUser = {
    user: null,
    setUser: () => { },
    profile: null,
    setProfile: () => { },
    loading: false
};

export const valAuthUser = {
    user: { id: '123' },
    setUser: () => { },
    profile: {
        id: "1",
        name: "Helene",
        avatar_url: "",
        favorites: ["2"],
        home_country_code: "es",
        home_lat: null,
        home_location_name: null,
        home_lon: null,
        skill_level: undefined,
        skating_style: ["cruising"],
        preferred_spot_types: [{ id: 1, name: "greenway" }, { id: 2, name: "bike_path" }]
    },
    setProfile: () => { },
    loading: false
};

export const spotsVal = {
    spots: [],
    setSpots: () => { },
    loading: false,
    error: null,
    loadSpots: vi.fn(),
    selectedSpot: null,
    setSelectedSpot: () => { },
    reversed: false,
    setReversed: () => { }
}

export const makeSpot = (overrides?: Partial<SpotFullInfo>): SpotFullInfo => ({
    id: "test-id",
    name: "Test Spot",
    slug: "test-spot",
    city: "Barcelona",
    country: "Spain",
    coordinates: [{ lat: 0, lon: 0 }],
    location_type: "route",
    address: null,
    created_by: null,
    description: null,
    length_km: null,
    photos: null,
    surface_quality: null,
    spot_types: [],
    traffic_levels: [],
    created_by_name: "Test User",
    creator_profile: null,
    average_rating: null,
    ...overrides,
});

HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute("open", "");
});

window.HTMLElement.prototype.scrollIntoView = vi.fn();

vi.mock("../features/theme/component/ThemeToggle", () => ({
    ThemeToggle: () => null,
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
    useMap: vi.fn(() => ({ flyTo: vi.fn(), setView: vi.fn(), getZoom: vi.fn(), invalidateSize: vi.fn() })),
    useMapEvents: vi.fn(() => null),
}));

vi.mock('react-leaflet-custom-control', () => ({
    default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('../features/map/components/MapBase/MapBase', () => ({
    MapBase: ({ children, other }: any) => (
        <div data-testid="map">
            {other}
            {children}
        </div>
    ),
}));

vi.mock('../features/map/components/RouteDisplay/RouteDisplay', () => ({
    RouteDisplay: ({ data }: any) => (
        <div data-testid="route-display" data-coords={JSON.stringify(data)} />
    ),
}));

vi.mock('../features/map/components/SpotMarker/SpotMarker', () => ({
    SpotMarker: ({ spot }: any) => <div data-testid={`marker-${spot.id}`} />
}));

vi.mock('../features/map/components/UserMarker/UserMarker', () => ({
    UserMarker: () => null,
}));

vi.mock('../features/spot_management/components/AddMarker/AddMarker', () => ({
    AddMarker: () => <div data-testid={"add-marker"} />
}));

vi.mock('../features/map/components/FlyToUser/FlyToUser', () => ({
    FlyToUser: () => null,
}));

vi.mock('../features/map/components/FlyToSpot/FlyToSpot', () => ({
    FlyToSpot: () => null,
}));

vi.mock('../services/geolocation', () => ({
    fetchRoute: vi.fn(),
    getBrowserPosition: vi.fn().mockResolvedValue({ data: null, error: null }),
    reverseGeocode: vi.fn().mockResolvedValue({ city: "Barcelona", country: "es", name: "B-10, Sant Martí, 08019 Barcelona" }),
}));

vi.mock('../services/data', () => ({
    insertData: vi.fn(),
    fetchData: vi.fn().mockResolvedValue({ data: [], error: null }),
    insertDataWithJunctions: vi.fn().mockResolvedValue({ error: null }),
}));

vi.mock("../services/auth", () => ({
    signIn: vi.fn(),
    loginWithGoogle: vi.fn(),
}));

export const mockNavigate = vi.fn();

vi.mock("react-router", async () => {
    const actual = await vi.importActual('react-router');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});