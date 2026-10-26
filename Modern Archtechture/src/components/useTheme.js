import { useEffect, useState } from "react";

const read = () => {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch (e) {
    //  storage unavailable
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export default function useTheme() {
  const [theme, setTheme] = useState(read);
  useEffect(() => {
    document.body.classList.toggle("dark-theme", theme === "dark");
    document.body.classList.toggle("light-theme", theme === "light");
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      //  ignore
    }
  }, [theme]);
  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return [theme, toggle];
}
