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
            primary: "bg-yellow text-dark font-bold active:bg-yellow-2 px-1.5 button-shadow",
            secondary: "border border-yellow text-yellow active:bg-rgba-dark font-medium px-1.5 button-shadow",
            tertiary: "px-[5px] text-yellow font-bold hover:text-turquoise",
            icon: "px-[5px] text-white hover:text-yellow"
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