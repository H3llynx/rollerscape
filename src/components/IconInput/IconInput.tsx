import type { ReactNode } from "react";
import "./IconInput.css";

type IconInput = {
    label: string;
    children: ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>

export function IconInput({ label, id, type = "checkbox", children, ...props }: IconInput) {
    return (
        <label
            htmlFor={id}
            aria-label={label}
            className="icon-label button-shadow"
        >
            <input
                className="sr-only"
                id={id}
                type={type}
                tabIndex={0}
                {...props}
            />
            {children}
        </label>
    )
}