import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Header } from '../Header/Header';
import "./Layout.css";

export function Layout() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="layout">
            <Header />
            <Outlet />
        </div>
    );
};