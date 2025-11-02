import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="flex items-center justify-between p-2">
      <label htmlFor="dark-toggle" className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            id="dark-toggle"
            className="sr-only"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
          {/* Track */}
          <div className="block w-10 h-6 rounded-full border border-foreground bg-background transition-colors duration-200"></div>
          {/* Knob */}
          <div
            className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 flex items-center justify-center bg-foreground ${
              theme === "dark" ? "translate-x-4" : "translate-x-0"
            }`}
          >
            {theme == "dark" && <Moon size={10} className="text-background" />}
            {theme == "light" && <Sun size={10} className="text-background" />}
          </div>
        </div>
      </label>
    </div>
  );
}
