"use client";

import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-medium ${
        isDarkMode
          ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700"
          : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
      }`}
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDarkMode ? (
        <>
          <Sun className="w-4 h-4" />
          <span className="hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-indigo-600" />
          <span className="hidden sm:inline">Dark</span>
        </>
      )}
    </button>
  );
}
