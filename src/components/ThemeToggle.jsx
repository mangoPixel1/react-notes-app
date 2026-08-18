import { useContext } from "react";
import { Sun, Monitor, Moon } from "lucide-react";

import { UIContext } from "../contexts/UIContext";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "system", label: "System", icon: Monitor },
  { value: "dark", label: "Dark", icon: Moon },
];

function ThemeToggle({ className = "" }) {
  const { theme, setTheme } = useContext(UIContext);

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={`inline-flex items-center gap-0.5 p-1 rounded-full backdrop-blur-sm bg-white/70 dark:bg-zinc-800/60 border border-black/5 dark:border-white/10 shadow-sm ${className}`}
    >
      {OPTIONS.map((option) => {
        const active = theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={option.label}
            title={option.label}
            onClick={() => setTheme(option.value)}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              active
                ? "bg-amber-500 text-white"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            <option.icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}

export default ThemeToggle;
