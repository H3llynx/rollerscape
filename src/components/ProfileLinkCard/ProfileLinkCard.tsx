import { NavLink, useLocation } from "react-router";
import Skater from "../../assets/skater.png";
import type { UserProfile } from "../../types/user_types";
import "./ProfileLinkCard.css";

export function ProfileLinkCard({ profile }: { profile: UserProfile }) {
    const location = useLocation();
    return (
        <NavLink to="/profile" aria-label="Go to profile page" className="profile-link-card">
            <img src={Skater} alt="" className="w-3.5 h-3.5 rounded-full p-[3px] border border-yellow" />
            <div className="flex flex-col">
                <span className="text-lg truncate max-w-[160px]"> Hi {profile?.name || "Rollerblader"}</span>
                <span className="font-main text-sm font-light">
                    {location.pathname === "/" ? "View profile" : "Welcome back!"}
                </span>
            </div>
        </NavLink>
    )
}