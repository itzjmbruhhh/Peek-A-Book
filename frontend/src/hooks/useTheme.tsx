/**
 * Hook: useTheme
 * Purpose: Manage light/dark theme preference. Persists selection
 * to localStorage and keeps a `light`/`dark` class on the document
 * root for CSS theming.
 */
import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  return { theme, toggle };
}
