import { X } from "lucide-react";
import { forwardRef, type ReactNode } from "react";

type Dialog = {
    children: ReactNode;
    close: () => void;
    onClickOut: (e: React.MouseEvent<HTMLDialogElement>) => void;
}

export const GalleryDialog = forwardRef<HTMLDialogElement, Dialog>(({ close, children, onClickOut }, ref) => {
    return (
        <dialog ref={ref} className="m-auto gap-1 backdrop:bg-black/90 backdrop:cursor-pointer bg-transparent"
            onClick={onClickOut}>
            <button onClick={close} tabIndex={0} aria-label="Close dialog" className="absolute right-0.5 top-0.5 text-text-secondary z-2">
                <X aria-hidden />
            </button>
            {children}
        </dialog>
    )
})