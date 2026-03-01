import type { ReactNode } from "react";

type SectionTemplate = {
    children: ReactNode;
    title?: string;
    titleWithButton?: ReactNode
}

export function SectionTemplate({ children, title, titleWithButton }: SectionTemplate) {
    return (
        <div className="border p-1 md:p-2 border-text rounded-xl relative bg-bg-rgba">
            {title && <h2 className="absolute -top-1 bg-blur">{title}</h2>}
            {titleWithButton && <div className="absolute -top-1 bg-blur max-w-[95%]">{titleWithButton}</div>}
            {children}
        </div>
    )
}