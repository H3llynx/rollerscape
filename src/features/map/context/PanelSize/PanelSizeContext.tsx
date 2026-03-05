import { createContext, type Dispatch, type RefObject, type SetStateAction } from "react";

export type PanelSizeContext = {
    textSmaller: boolean;
    setTextSmaller: Dispatch<SetStateAction<boolean>>;
    scrollableRef: RefObject<HTMLDivElement | null>;
};

export const PanelSizeContext = createContext<PanelSizeContext | null>(null);