import { createContext, type Dispatch, type SetStateAction } from "react";

export type PanelSizeContext = {
    textSmaller: boolean;
    setTextSmaller: Dispatch<SetStateAction<boolean>>;
};

export const PanelSizeContext = createContext<PanelSizeContext | null>(null);