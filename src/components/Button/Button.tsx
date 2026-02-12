import type { ReactNode } from 'react';
import { tv } from 'tailwind-variants';

type Button = {
    children: ReactNode;
    color?: keyof typeof buttonVariants.variants.color;
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const buttonVariants = tv({
    base: "font-main text-sm rounded-lg py-0.5 px-1 border border-transparent button-shadow hover:-translate-y-[1px]",
    variants: {
        color: {
            primary: "bg-yellow text-dark font-bold active:bg-yellow-2",
            secondary: "border border-yellow text-yellow active:bg-rgba-dark",
        }
    }
});

export function Button({ children, color = "primary", ...props }: Button) {
    return (
        <button className={buttonVariants({ color })}
            tabIndex={0}
            {...props}
        >
            {children}
        </button>
    )
}