import { NavLink, useLocation } from "react-router";
import Skater from "../../assets/skater.png";
import { showAvatar } from "../../features/profile/utils";
import type { UserProfile } from "../../types/user_types";
import "./ProfileLinkCard.css";

export function ProfileLinkCard({ profile }: { profile: UserProfile }) {
    const location = useLocation();
    if (!profile) return;

    return (
        <NavLink to="/profile" aria-label="Go to profile page" className="profile-link-card bg-blur slight-shadow">
            <img src={showAvatar(profile)} alt="Profile avatar" className="profile-avatar" onError={(e) => {
                const img = e.currentTarget;
                if (img.src !== Skater) {
                    img.src = Skater;
                }
            }} />
            <div className="flex flex-col min-w-0 flex-1">
                <span className="text-md truncate"> Hi {profile.name || "Rollerblader"}</span>
                <span className="font-main text-sm font-light">
                    {location.pathname === "/" ? "View profile" : "Welcome back!"}
                </span>
            </div>
        </NavLink>
    )
}