import { useContext } from "react";
import { SpotsContext } from "../context/SpotsContext";

export const useSpots = () => {
    const context = useContext(SpotsContext)
    if (!context) {
        throw new Error("Spot context / provider error")
    }
    return context;
};