/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--tw-ink) / <alpha-value>)",
        mute: "rgb(var(--tw-muted) / <alpha-value>)",
        line: "rgb(var(--tw-line) / <alpha-value>)",
        surface: "rgb(var(--tw-surface) / <alpha-value>)",
        surface2: "rgb(var(--tw-surface-2) / <alpha-value>)",
        gold: "#d4a44b",
        "gold-dark": "#b3891f",
        "gold-light": "#ecc87a",
        bronze: "#c69b7b",
        olive: "#8a8f5b",
        brick: "#b5523b",
        charcoal: "#222222",
      },
      fontFamily: {
        body: ["Poppins", "Segoe UI", "Arial", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
        logo: ["Bebas Neue", "Impact", "sans-serif"],
      },
      boxShadow: {
        luxe: "var(--shadow)",
        glow: "0 6px 18px rgba(212, 164, 75, 0.35)",
      },
    },
  },
  plugins: [],
};
