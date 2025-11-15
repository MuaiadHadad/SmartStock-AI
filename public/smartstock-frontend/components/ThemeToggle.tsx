"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  label?: string;
}

export function ThemeToggle({ className, label }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition hover:scale-[1.02] hover:border-emerald-400/60 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 dark:border-slate-800/80 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:text-white ${className ?? ""}`.trim()}
      aria-label={label ?? "Alternar tema"}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-emerald-500 transition-transform duration-200" />
      ) : (
        <Moon className="h-4 w-4 text-emerald-500 transition-transform duration-200" />
      )}
      <span className="hidden text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 sm:inline">
        {theme === "dark" ? "Luz" : "Escuro"}
      </span>
    </button>
  );
}
