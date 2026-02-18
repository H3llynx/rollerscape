import { type ReactNode } from "react";

export type Dropdown = {
    children: ReactNode;
    label?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>


export function Dropdown({ label, id, children, ...props }: Dropdown) {
    return (
        <label htmlFor={id}>
            {label && <span>{label}</span>}
            <select
                className="h-[35px] px-0.5 slight-shadow bg-blur bg-bg-rgba-2 w-full max-w-2xs rounded-lg border border-grey font-main font-medium text-sm"
                id={id}
                {...props}
            >
                {children}
            </select>
        </label>
    )
}