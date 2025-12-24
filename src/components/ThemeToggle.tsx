import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-full cursor-pointer transition-colors"
            aria-label="Toggle theme"
        >
            <div className="relative w-5 h-5 text-tertiary hover:text-accent">
                <Sun
                    className={`absolute h-6 w-6 transition-all  ${
                        theme === "dark"
                            ? "scale-0 rotate-90"
                            : "scale-100 rotate-0"
                    }`}
                    fill="currentColor"
                />
                <Moon
                    className={`absolute h-6 w-6 transition-all  ${
                        theme === "dark"
                            ? "scale-100 rotate-0"
                            : "scale-0 -rotate-90"
                    }`}
                    fill="currentColor"
                />
            </div>
        </button>
    );
}
