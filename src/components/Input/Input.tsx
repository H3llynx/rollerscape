import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { tv } from "tailwind-variants";
import "./Input.css";

type Input = {
    icons?: boolean;
    variant?: keyof typeof labelVariants.variants.variant;
    label?: string;
} & React.InputHTMLAttributes<HTMLInputElement>

const labelVariants = tv({
    base: "label",
    variants: {
        variant: {
            text: "flex flex-col",
            textMap: "flex flex-col font-main font-medium",
            checkbox: "flex py-1 text-sm font-medium text-grey flex-row-reverse cursor-pointer justify-end font-main has-checked:text-text bg-bg-rgba-2",
        }
    }
});

export function Input({ variant = "text", label, type, id, placeholder, icons = true, ...props }: Input) {
    return (
        <label className={labelVariants({ variant })} htmlFor={id}>
            {label && <span>{label}</span>}
            <div className="input-container">
                <input
                    className="slight-shadow bg-blur"
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    tabIndex={0}
                    {...props}
                />
                {icons &&
                    <>
                        <CheckCircle2 aria-hidden className="valid-svg" />
                        <AlertCircle aria-hidden className="error-svg" />
                    </>
                }
            </div>
        </label>
    )

}