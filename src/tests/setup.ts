import '@testing-library/jest-dom';
import { vi } from 'vitest';
import type { SpotFullInfo } from '../types/spots_types';

vi.mock("../features/theme/component/ThemeToggle", () => ({
    ThemeToggle: () => null,
}));


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
        favorites: [],
        home_country_code: "es",
        home_lat: null,
        home_location_name: null,
        home_lon: null,
        skill_level: undefined,
        skating_style: ["cruising"],
        preferred_spot_types: ["greenway"]
    },
    setProfile: () => { },
    loading: false
};

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

