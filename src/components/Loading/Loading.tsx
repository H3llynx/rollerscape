import Wheel from "../../assets/svg/wheel.svg?react";
import "./Loading.css";

export function Loading() {
    return (
        <div className="roller-loader">
            {[0, 1, 2, 3].map((i) => (
                <Wheel key={i} className="wheel" />
            ))}
        </div>
    )
}