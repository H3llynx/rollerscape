import { NavLink, useLocation } from "react-router";
import { showAvatar } from "../../features/profile/utils";
import type { UserProfile } from "../../types/user_types";
import "./ProfileLinkCard.css";

export function ProfileLinkCard({ profile }: { profile: UserProfile }) {
    const location = useLocation();
    if (!profile) return;

    return (
        <NavLink to="/profile" aria-label="Go to profile page" className="profile-link-card">
            <img src={showAvatar(profile)} alt="" className="profile-avatar" />
            <div className="flex flex-col min-w-0 flex-1">
                <span className="text-md truncate"> Hi {profile.name || "Rollerblader"}</span>
                <span className="font-main text-sm font-light">
                    {location.pathname === "/" ? "View profile" : "Welcome back!"}
                </span>
            </div>
        </NavLink>
    )
}