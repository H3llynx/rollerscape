import type { ReactNode } from "react";

type SectionTemplate = {
    children: ReactNode;
    title?: string;
    titleWithButton?: ReactNode
}

export function SectionTemplate({ children, title, titleWithButton }: SectionTemplate) {
    return (
        <div className="md:border md:p-2 border-text rounded-xl relative md:bg-bg-rgba bg-blur">
            {title && <h2 className="md:absolute -top-1 bg-blur">{title}</h2>}
            {titleWithButton && <div className="md:absolute -top-1 bg-blur max-w-[95%]">{titleWithButton}</div>}
            {children}
        </div>
    )
}