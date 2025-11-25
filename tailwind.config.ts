import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  important: ".zoom-ui-toolkit-root",
  theme: {
    extend: {
      colors: {
        // Default theme color
        primary: {
          light: "#4A90E2",
          DEFAULT: "#1d75c3",
          dark: "#003a80",
        },
        secondary: {
          light: "#FF2D55",
          DEFAULT: "#ff1a47",
          dark: "#cc0027",
        },
        // Theme variables
        theme: {
          primary: "var(--color-primary)",
          secondary: "var(--color-secondary)",
          background: "var(--color-background)",
          surface: "var(--color-surface)",
          "surface-elevated": "var(--color-surface-elevated)",
          text: "var(--color-text)",
          "text-button": "var(--color-text-button)",
          "text-secondary": "var(--color-text-secondary)",
          accent: "var(--color-accent)",
          divider: "var(--color-divider)",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
export default config;
