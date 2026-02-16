import Logo from "../../assets/logo.png";
import { ThemeToggle } from "../../features/theme/component/ThemeToggle";
import { Navbar } from "../Navbar/Navbar";
import "./Header.css";

export function Header() {
    return (
        <header>
            <img className="logo-img" src={Logo} alt="RollerScape logo" />
            <ThemeToggle />
            <Navbar />
        </header>
    )
}