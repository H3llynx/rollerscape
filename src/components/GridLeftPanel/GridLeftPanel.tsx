import type { ReactNode } from "react";
import "./GridLeftPanel.css";

type GridLeftPanel = {
    collapsed?: boolean;
    children: ReactNode;
}

export function GridLeftPanel({ children, collapsed = true }: GridLeftPanel) {
    return (
        <div className={`full-width-container
            ${collapsed
                ? "collapsed"
                : "expanded"
            }`}
        >
            {children}
        </div>
    )
}