import { NavLink } from "react-router";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
import Logo from "../../assets/logo.png";
import { useSpots } from "../../features/map/hooks/useContexts";
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
            map: "fixed"
        }
    }
});

export function Header({ style = "default", className }: Header) {
    const { selectedSpot, setSelectedSpot } = useSpots();

    const unSelectSpot = () => {
        if (!selectedSpot) return;
        setSelectedSpot(null);
    }

    return (
        <header className={twMerge(headerVariants({ style }), className)}>
            <NavLink to="/" className="pointer-events-auto" tabIndex={0} onClick={unSelectSpot}>
                <img className="logo-img" src={Logo} alt="RollerScape logo" /></NavLink>
            <Navbar />
        </header>
    )
}