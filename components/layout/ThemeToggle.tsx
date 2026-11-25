"use client";

import { useEffect, useRef, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { ensureGsapRegistered, gsap, prefersReducedMotion } from "@/lib/gsap/client";

type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "sportsera-theme";

export function ThemeToggle(): React.ReactElement {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [mounted, setMounted] = useState(false);
  const iconWrapRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const active = document.documentElement.dataset.theme === "light" ? "light" : "dark";
      setTheme(active);
      setMounted(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggleTheme = (): void => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Ignore storage failures in restricted browsing contexts.
    }
    if (iconWrapRef.current && !prefersReducedMotion()) {
      ensureGsapRegistered();
      gsap.fromTo(
        iconWrapRef.current,
        { rotate: nextTheme === "light" ? -65 : 65, scale: 0.65 },
        { rotate: 0, scale: 1, duration: 0.42, ease: "back.out(2)", clearProps: "transform" }
      );
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
      className="menu-trigger inline-flex h-9 w-9 items-center justify-center sm:h-10 sm:w-10"
    >
      <span ref={iconWrapRef} className="relative inline-flex h-4 w-4 items-center justify-center">
        <FiSun
          className={`absolute h-4 w-4 text-amber-400 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            mounted && theme === "light" ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
          aria-hidden="true"
        />
        <FiMoon
          className={`absolute h-4 w-4 text-slate-700 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            mounted && theme === "light" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"
          }`}
          aria-hidden="true"
        />
      </span>
    </button>
  );
}
