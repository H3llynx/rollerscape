import { Moon, Sun } from "lucide-react";
import Wheel from "../../../assets/svg/wheel.svg?react";
import { useTheme } from "../hook/useTheme";
import "./ThemeToggle.css";

export function ThemeToggle() {
  const { toggleTheme, theme } = useTheme();
  return (
    <label className="theme-switcher" aria-label="Switch theme">
      {theme === "light" &&
        <Sun fill="var(--color-txt-main)" className="theme-svg" />
      }
      <input
        type="checkbox"
        className="theme-checkbox"
        onChange={toggleTheme}
        defaultChecked={theme === "dark"}
      />
      <div className="switcher-track">
        <div className="switcher-thumb">
          <Wheel className="roller-wheel" />
        </div>
      </div>
      {theme === "dark" &&
        <Moon fill="var(--color-txt-main)" className="theme-svg" />
      }
    </label>
  )
}
