"use client";

import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "sportsera-theme";

export function ThemeToggle(): React.ReactElement {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const active = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    setTheme(active);
    setMounted(true);
  }, []);

  const toggleTheme = (): void => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Ignore storage failures in restricted browsing contexts.
    }
    setTheme(nextTheme);
  };

  const label = !mounted
    ? "Toggle color theme"
    : theme === "dark"
      ? "Switch to light theme"
      : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="menu-trigger inline-flex h-10 w-10 items-center justify-center"
    >
      {mounted && theme === "light" ? (
        <FiMoon className="h-4 w-4 text-slate-700" aria-hidden="true" />
      ) : (
        <FiSun className="h-4 w-4 text-amber-400" aria-hidden="true" />
      )}
    </button>
  );
}
