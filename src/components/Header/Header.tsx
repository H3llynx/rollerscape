import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
import Logo from "../../assets/logo.png";
import { Navbar } from "../Navbar/Navbar";
import "./Header.css";

type Header = {
    style?: keyof typeof headerVariants.variants.style;
} & React.HTMLAttributes<HTMLElement>

const headerVariants = tv({
    base: "top-0 z-2 md:z-1 flex flex-row-reverse md:flex-row w-full justify-between p-1 items-start",
    variants: {
        style: {
            default: "sticky",
            map: "absolute"
        }
    }
});

export function Header({ style = "default", className }: Header) {

    return (
        <header className={twMerge(headerVariants({ style }), className)}>
            <img className="logo-img" src={Logo} alt="RollerScape logo" />
            <Navbar />
        </header>
    )
}