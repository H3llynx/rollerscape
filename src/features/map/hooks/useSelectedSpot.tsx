import { useContext } from "react";
import { SelectedSpotContext } from "../context/SelectedSpot/SelectedSpotContext";

export const useSpots = () => {
    const context = useContext(SelectedSpotContext)
    if (!context) {
        throw new Error("SelectedSpot context / provider error")
    }
    return context;
};