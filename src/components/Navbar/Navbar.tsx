import { Home, LogIn, LogOut, Menu, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { ThemeToggle } from "../../features/theme/component/ThemeToggle";
import { signOut } from "../../services/auth";
import { Button } from "../Button/Button";
import { ProfileLinkCard } from "../ProfileLinkCard/ProfileLinkCard";
import "./Navbar.css";

export function Navbar() {
    const { user, profile, loading } = useAuth();
    const location = useLocation();
    const getTabIndex = (path: string) => location.pathname === path ? -1 : 0;
    const menuToggleRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

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

    const handleSignOut = async () => {
        await signOut();
        navigate("/auth");
    }

    return (
        <nav className="navbar">
            <label
                htmlFor="menu-toggle" className="menu-toggle">
                <input
                    type="checkbox"
                    className="input-menu"
                    id="menu-toggle"
                    ref={menuToggleRef}
                    aria-expanded="false"
                    aria-controls="main-menu"
                    onChange={handleMenu}
                />
                <Menu aria-hidden className="menu" />
                <X aria-hidden className="close" />
            </label>
            <ul id="main-menu">
                <li><ThemeToggle /></li>
                <li><NavLink to="/" tabIndex={getTabIndex("/")}><Home aria-label="Home page" /></NavLink></li>
                <li className="auth">
                    {user && !loading &&
                        <>
                            <ProfileLinkCard profile={profile!} />
                            <Button style="icon" aria-label="Log out" onClick={handleSignOut}>
                                <LogOut aria-hidden className="logout" />
                            </Button>

                        </>
                    }
                    {!user && <NavLink to="/auth" aria-label="Sign in" tabIndex={0}>
                        <LogIn aria-hidden /></NavLink>}
                </li>
            </ul>
        </nav>
    )
}