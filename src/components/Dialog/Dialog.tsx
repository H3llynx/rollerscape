import { X } from "lucide-react";
import { forwardRef, type ReactNode } from "react";
import { tv } from "tailwind-variants/lite";

type Dialog = {
    style?: keyof typeof dialogVariants.variants.style;
    children: ReactNode;
    close: () => void;
}

const dialogVariants = tv({
    base: "m-auto [[open]]:flex [[open]]:flex-col gap-1 text-center rounded-lg border backdrop:bg-black/50 font-main font-medium border-grey text-sm bg-rgba-dark pt-1 pb-2 px-2 bg-blur dialog-shadow",
    variants: {
        style: {
            default: "text-white",
            error: "text-red"
        }
    }
});

export const Dialog = forwardRef<HTMLDialogElement, Dialog>(({ close, children, style = "default" }, ref) => {
    return (
        <dialog ref={ref} className={dialogVariants({ style })}>
            <button onClick={close} aria-label="Close dialog" className="self-end">
                <X aria-hidden />
            </button>
            {children}
        </dialog>
    )
})