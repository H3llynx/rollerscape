import { useContext } from "react";
import { PanelSizeContext } from "../context/PanelSize/PanelSizeContext";
import { SpotsContext } from "../context/Spots/SpotsContext";

export const useSpots = () => {
    const context = useContext(SpotsContext)
    if (!context) {
        throw new Error("Spot context / provider error")
    }
    return context;
};

export const usePanelSize = () => {
    const context = useContext(PanelSizeContext)
    if (!context) {
        throw new Error("Panel size context / provider error")
    }
    return context;
}