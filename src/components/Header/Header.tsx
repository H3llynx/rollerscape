import Logo from "../../assets/logo.png";
import { Navbar } from "../Navbar/Navbar";
import "./Header.css";

export function Header() {
    return (
        <header>
            <img className="logo-img" src={Logo} alt="RollerScape logo" />
            <Navbar />
        </header>
    )
}