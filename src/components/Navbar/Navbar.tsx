import { Home, LogOut, Menu, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { logOut } from "../../features/auth/services/auth";


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

    return (
        <nav className="navbar">
            <label htmlFor="menu-toggle" aria-label="open/close menu" className="menu-toggle">
                <input type="checkbox" className="sr-only" id="menu-toggle" ref={menuToggleRef} />
                <Menu aria-hidden="true" className="menu" />
                <X aria-hidden="true" className="close" />
            </label>
            <ul>
                <li className="auth">
                    {user && !loading &&
                        <>
                            <span> Hi {profile?.name || "Rollerblader"}</span>
                            <button aria-label="Log out" onClick={logOut}>
                                <LogOut aria-hidden="true" width={20} />
                            </button>
                        </>
                    }
                    {!user && <NavLink to="/auth" tabIndex={0}>Login</NavLink>}
                </li>
                <li><NavLink to="/" tabIndex={getTabIndex("/")}><Home aria-label="Home page" /></NavLink></li>
                <li><NavLink to="*" tabIndex={getTabIndex("*")}>Events</NavLink></li>
            </ul>
        </nav>
    )
}