import type { ReactNode } from "react";
import "./GridLeftPanel.css";

type GridLeftPanel = {
    collapsed?: boolean;
    children: ReactNode;
    isAdding?: boolean;
}

export function GridLeftPanel({ children, isAdding = false, collapsed = true }: GridLeftPanel) {
    return (
        <div className={`full-width-container
            ${collapsed
                ? "collapsed"
                : `expanded ${isAdding ? "grid-rows-[1fr_80px]" : "grid-rows-[1fr_25%]"}`
            }`}
        >
            {children}
        </div>
    )
}