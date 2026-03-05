import type { ReactNode } from "react";
import "./GridLeftPanel.css";

type GridLeftPanel = {
    collapsed?: boolean;
    children: ReactNode;
    textSmaller?: boolean;
}

export function GridLeftPanel({ children, textSmaller = false, collapsed = true }: GridLeftPanel) {
    return (
        <div className={`full-width-container
            ${collapsed
                ? "collapsed"
                : `expanded ${textSmaller ? "grid-rows-[1fr_65px]" : "grid-rows-[1fr_25%]"}`
            }`}
        >
            {children}
        </div>
    )
}