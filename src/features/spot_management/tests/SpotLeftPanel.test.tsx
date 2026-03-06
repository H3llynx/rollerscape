import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from "vitest";
import { reviewFormFields } from '../../../config/spots';
import { insertData } from '../../../services/data';
import { makeSpot, valAuthNoUser, valAuthUser } from '../../../tests/setup';
import { AuthContext } from '../../auth/context/AuthContext';
import { SpotMap } from '../../map/components/SpotMap/SpotMap';
import { PanelSizeProvider } from '../../map/context/PanelSize/PanelSizeProvider';
import { SpotsContext } from '../../map/context/Spots/SpotsContext';

window.HTMLElement.prototype.scrollIntoView = vi.fn();

vi.mock("../../map/hooks/useCenter", () => ({
    useCenter: () => ({
        center: [40.4168, -3.7038],
        setCenter: vi.fn(),
        error: null,
        setError: vi.fn(),
        trackUser: vi.fn(),
        profile: null,
    })
}));

const mockSpots = [
    makeSpot({ id: "1", name: "Spot A", spot_types: [{ id: "1", name: "street_plaza" }], created_by: "1" }),
    makeSpot({ id: "2", name: "Spot B", spot_types: [{ id: "2", name: "greenway" }] }),
];

const MapArea = (spotContext: any, userContext: any) => (
    <MemoryRouter>
        <AuthContext value={userContext}>
            <SpotsContext value={spotContext}>
                <PanelSizeProvider>
                    <SpotMap zoom={12} />
                </PanelSizeProvider>
            </SpotsContext>
        </AuthContext>
    </MemoryRouter>
);

const spotsVal = {
    spots: mockSpots,
    setSpots: () => { },
    loading: false,
    error: null,
    loadSpots: vi.fn().mockResolvedValue(undefined),
    selectedSpot: mockSpots[0],
    setSelectedSpot: () => { },
}

vi.mock('../../../services/data', () => ({
    insertData: vi.fn(),
}))


describe("Left panel content display", () => {
    it("when a spot is selected, should show its description", () => {
        render(MapArea(spotsVal, valAuthNoUser));
        expect(document.querySelector("#spot-description-1")).toBeInTheDocument();
    });
    it("if the user is authenticated, should allow them to save the spot in their favorite", () => {
        render(MapArea(spotsVal, valAuthUser));
        expect(screen.getByLabelText(/save as favorite/i)).toBeInTheDocument();
    });
    it("if the user is authenticated, should allow them to comment the spot", () => {
        render(MapArea(spotsVal, valAuthUser));
        expect(screen.getByRole("button", { name: /rate this spot!|be the first!/i })).toBeInTheDocument();
    });
    it("else not", () => {
        render(MapArea(spotsVal, valAuthNoUser));
        expect(screen.queryByLabelText(/save as favorite/i)).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /rate this spot!|be the first!/i })).not.toBeInTheDocument();
    });
    it("if the user is authenticated and is the spot creator, should allow them to edit the spot details", () => {
        render(MapArea(spotsVal, valAuthUser));
        expect(screen.getByLabelText(/edit spot/i)).toBeInTheDocument();
    });
    it("if the user is authenticated and is the spot creator, should allow them to delete the spot", () => {
        render(MapArea(spotsVal, valAuthUser));
        expect(screen.getByLabelText(/delete spot/i)).toBeInTheDocument();
    });
    it("else not (authenticated user but not the spot creator)", () => {
        render(MapArea({ ...spotsVal, selectedSpot: mockSpots[1] }, valAuthUser));
        expect(screen.queryByLabelText(/edit spot/i)).not.toBeInTheDocument();
        expect(screen.queryByLabelText(/delete spot/i)).not.toBeInTheDocument();
    });
    it("else not (unauthenticated user)", () => {
        render(MapArea(spotsVal, valAuthNoUser));
        expect(screen.queryByLabelText(/edit spot/i)).not.toBeInTheDocument();
        expect(screen.queryByLabelText(/delete spot/i)).not.toBeInTheDocument();
    });
    it("when a user clicks on the edit button for of htis, should show its edition form", async () => {
        render(MapArea(spotsVal, valAuthUser));
        await userEvent.click(screen.getByRole("button", { name: /edit spot/i }));
        expect(document.querySelector("#spot-edition-1")).toBeInTheDocument();
    });
});

describe("adding reviews to a spot", async () => {
    const user = userEvent.setup();
    it("should show the review form once an authenticated user clicks on the review button", async () => {
        render(MapArea(spotsVal, valAuthUser));
        await user.click(screen.getByRole("button", { name: /rate this spot!|be the first!/i }));
        expect(screen.getByLabelText(/spot review/i)).toBeInTheDocument();
    });
    it("should block the submission if the user does not provide a score", async () => {
        render(MapArea(spotsVal, valAuthUser));
        await user.click(screen.getByRole("button", { name: /rate this spot!|be the first!/i }));
        await user.click(screen.getByRole("button", { name: /rate this spot/i }));
        expect(document.getElementById(reviewFormFields.score.id)).toBeInvalid();
    });
    it("should display the new comment on the description page on success", async () => {
        vi.mocked(insertData).mockResolvedValue({ data: null, error: null });
        render(MapArea(spotsVal, valAuthUser));
        await user.click(screen.getByRole("button", { name: /rate this spot!|be the first!/i }));
        fireEvent.change(screen.getByLabelText(reviewFormFields.score.label), {
            target: { value: 4 }
        });
        screen.debug(screen.getByRole("form"));
        await user.type(document.getElementById(reviewFormFields.comment.id) as HTMLElement, "Cool place!");
        await user.click(screen.getByRole("button", { name: /rate this spot/i }));
        await waitFor(() => {
            expect(vi.mocked(insertData)).toHaveBeenCalled();
            expect(spotsVal.loadSpots).toHaveBeenCalled();
        });
    });
})