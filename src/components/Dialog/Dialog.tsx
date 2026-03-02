import { X } from "lucide-react";
import { forwardRef, type ReactNode } from "react";
import { tv } from "tailwind-variants/lite";

type Dialog = {
    style?: keyof typeof dialogVariants.variants.style;
    children: ReactNode;
    close: () => void;
}

const dialogVariants = tv({
    base: "m-auto [[open]]:flex [[open]]:flex-col gap-1 text-center rounded-lg border backdrop:bg-black/20 font-main font-medium border-grey text-sm bg-bg-rgba py-2 px-3 bg-blur dialog-shadow overflow-hidden max-w-lg",
    variants: {
        style: {
            default: "text-text",
            error: "text-red"
        }
    }
});

export const Dialog = forwardRef<HTMLDialogElement, Dialog>(({ close, children, style = "default" }, ref) => {
    return (
        <dialog ref={ref} className={dialogVariants({ style })}>
            <button onClick={close} tabIndex={0} aria-label="Close dialog" className="absolute top-1 right-1">
                <X aria-hidden />
            </button>
            {children}
        </dialog>
    )
})