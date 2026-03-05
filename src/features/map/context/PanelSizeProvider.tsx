import { useRef, useState, type ReactNode } from "react";
import { PanelSizeContext } from "./PanelSizeContext";

export function PanelSizeProvider({ children }: { children: ReactNode }) {
    const [textSmaller, setTextSmaller] = useState<boolean>(false);
    const scrollableRef = useRef<HTMLDivElement>(null);

    const value = { textSmaller, setTextSmaller, scrollableRef };

    return (
        <PanelSizeContext value={value}>
            {children}
        </PanelSizeContext>
    )
}