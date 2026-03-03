import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getBrowserPosition } from '../../../../services/geolocation';
import { valAuthNoUser, valAuthUser } from '../../../../tests/setup';
import { AuthContext } from '../../../auth/context/AuthContext';
import { useCenter } from '../useCenter';

vi.mock("../../../../services/geolocation", () => ({
    getBrowserPosition: vi.fn(),
}));

describe("Getting browser location", () => {
    it("sets center from profile when user has home coordinates", () => {
        vi.mocked(getBrowserPosition).mockResolvedValueOnce({
            data: { lat: 40.4168, lon: -3.7038 },
            error: null,
        });
        const userWithHome = {
            ...valAuthUser,
            profile: { ...valAuthUser.profile, home_lat: 41.0, home_lon: -2.0 }
        };
        const wrapper = ({ children }: any) => (
            <AuthContext value={userWithHome as any}>
                {children}
            </AuthContext>
        );
        const { result } = renderHook(() => useCenter(), { wrapper });
        expect(result.current.center).toEqual([41.0, -2.0]);
    });
    it("calls getBrowserPosition when no user is logged in", () => {
        vi.mocked(getBrowserPosition).mockResolvedValueOnce({
            data: { lat: 40.4168, lon: -3.7038 },
            error: null,
        });
        const wrapper = ({ children }: any) => (
            <AuthContext value={valAuthNoUser as any}>
                {children}
            </AuthContext>
        );
        renderHook(() => useCenter(), { wrapper });
        expect(vi.mocked(getBrowserPosition)).toHaveBeenCalled();
    });
    it("sets error if browser localisation is declined", async () => {
        vi.mocked(getBrowserPosition).mockResolvedValueOnce({
            data: null,
            error: { code: 1 } as any,
        });
        const wrapper = ({ children }: any) => (
            <AuthContext value={valAuthNoUser}>
                {children}
            </AuthContext>
        );
        const { result } = renderHook(() => useCenter(), { wrapper });
        expect(typeof (result.current.error)).not.toBeNull();
    });
});