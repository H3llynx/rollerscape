import { Home, LogIn, LogOut, Menu, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { signOut } from "../../features/auth/services/auth";
import { Button } from "../Button/Button";

import "./Navbar.css";

export function Navbar() {
    const { user, profile, loading } = useAuth();
    const location = useLocation();
    const getTabIndex = (path: string) => location.pathname === path ? -1 : 0;
    const menuToggleRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (menuToggleRef.current) {
            menuToggleRef.current.checked = false;
        }
    }, [location.pathname]);

    const handleMenu = () => {
        const input = menuToggleRef.current;
        if (input) {
            input.setAttribute("aria-expanded", input.checked ? "true" : "false");
        }
        console.log(input)
    }

    return (
        <nav className="navbar">
            <label
                htmlFor="menu-toggle" className="menu-toggle">
                <input
                    type="checkbox"
                    className="sr-only"
                    id="menu-toggle"
                    ref={menuToggleRef}
                    aria-expanded="false"
                    aria-controls="main-menu"
                    onChange={handleMenu}
                />
                <Menu aria-hidden="true" className="menu" />
                <X aria-hidden="true" className="close" />
            </label>
            <ul id="main-menu">
                <li className="auth">
                    {user && !loading &&
                        <>
                            <span> Hi {profile?.name || "Rollerblader"}</span>
                            <Button style="icon" aria-label="Log out" onClick={signOut}>
                                <LogOut aria-hidden="true" width={20} />
                            </Button>
                        </>
                    }
                    {!user && <NavLink to="/auth" aria-label="Sign in" tabIndex={0}>
                        <LogIn aria-hidden="true" /></NavLink>}
                </li>
                <li><NavLink to="/" tabIndex={getTabIndex("/")}><Home aria-label="Home page" /></NavLink></li>
                <li><NavLink to="/events" tabIndex={getTabIndex("/events")}>Events</NavLink></li>
            </ul>
        </nav>
    )
}