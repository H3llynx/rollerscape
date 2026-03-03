import Wheel from "../../assets/wheel.png";
import "./Loading.css";

export function Loading() {
    return (
        <div className="roller-loader" aria-label="Loading">
            {[0, 1, 2, 3].map((i) => (
                <div key={i} className="wheel">
                    <img src={Wheel} alt="Loading..." />
                </div>
            ))}
        </div>
    )
}