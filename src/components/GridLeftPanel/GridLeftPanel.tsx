import type { ReactNode } from "react";
import "./GridLeftPanel.css";

type GridLeftPanel = {
    collapsed?: boolean;
    children: ReactNode;
    isAddingRoute?: boolean;
}

export function GridLeftPanel({ children, isAddingRoute = false, collapsed = true }: GridLeftPanel) {
    return (
        <div className={`full-width-container
            ${collapsed
                ? "collapsed"
                : `expanded ${isAddingRoute ? "grid-rows-[1fr_60px]" : "grid-rows-[1fr_25%]"}`
            }`}
        >
            {children}
        </div>
    )
}