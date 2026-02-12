import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { tv } from "tailwind-variants";
import "./Input.css";

export type Input = {
    variant?: keyof typeof labelVariants.variants.variant;
    label?: string;
} & React.InputHTMLAttributes<HTMLInputElement>

const labelVariants = tv({
    base: "label",
    variants: {
        variant: {
            text: "flex flex-col",
            checkbox: "flex flex-row font-bold cursor-pointer",
        }
    }
});

export function Input({ variant = "text", label, type, id, placeholder, required, ...props }: Input) {
    return (
        <label className={labelVariants({ variant })} htmlFor={id}>
            {label && <span className="label">{label}</span>}
            <div className="input-container">
                <input
                    className="input-shadow bg-blur"
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    {...props}
                />
                {required &&
                    <>
                        <CheckCircle2 aria-hidden="true" className="valid-svg" />
                        <AlertCircle aria-hidden="true" className="error-svg" />
                    </>
                }
            </div>
        </label>
    )

}