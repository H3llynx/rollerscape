import { createContext, type Dispatch, type RefObject, type SetStateAction } from "react";

export type PanelSizeContext = {
    textSmaller: boolean;
    setTextSmaller: Dispatch<SetStateAction<boolean>>;
    scrollableRef: RefObject<HTMLDivElement>;
};

export const PanelSizeContext = createContext<PanelSizeContext | null>(null);