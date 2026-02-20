import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';

type Button = {
    children: ReactNode;
    style?: keyof typeof buttonVariants.variants.style;
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const buttonVariants = tv({
    base: "flex gap-0.5 items-center justify-center font-main text-sm rounded-lg py-0.5 border border-transparent hover:-translate-y-[1px]",
    variants: {
        style: {
            primary: "bg-bg-cta text-text-cta font-bold active:bg-bg-cta-active px-1.5 button-shadow",
            secondary: "border active:bg-bg-rgba font-medium px-1.5 button-shadow bg-bg-cta-secondary text-text-secondary border-text-secondary",
            tertiary: "px-[5px] text-text-secondary font-bold hover:text-grey",
            icon: "px-[5px] text-text hover:text-text-secondary",
            readMore: "p-0 border-0 text-xs font-medium text-grey hover:text-text-secondary"
        }
    }
});

export function Button({ children, style = "primary", className, ...props }: Button) {
    return (
        <button className={twMerge(buttonVariants({ style }), className)}
            tabIndex={0}
            {...props}
        >
            {children}
        </button>
    )
}