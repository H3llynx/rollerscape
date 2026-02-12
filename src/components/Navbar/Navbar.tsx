import { Menu, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router";
import Logo from "../../assets/logo.png";
import "./Navbar.css";

export function Navbar() {
    const location = useLocation();
    const getTabIndex = (path: string) => location.pathname === path ? -1 : 0;
    const menuToggleRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (menuToggleRef.current) {
            menuToggleRef.current.checked = false;
        }
    }, [location.pathname]);

    return (
        <nav className="navbar">
            <label htmlFor="menu-toggle" aria-label="open/close menu" className="menu-toggle">
                <input type="checkbox" className="sr-only" id="menu-toggle" ref={menuToggleRef} />
                <Menu aria-hidden="true" className="menu" />
                <X aria-hidden="true" className="close" />
            </label>
            <img className="logo-img hidden" src={Logo} alt="RollerScape logo" />
            <ul>
                <li><NavLink to="/" tabIndex={getTabIndex("/")}>Home</NavLink></li>
                <li><NavLink to="/map" tabIndex={getTabIndex("/map")}>Login</NavLink></li>
            </ul>
        </nav>
    )
}