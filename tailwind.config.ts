import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#030a1a",
        surface: { DEFAULT: "#0a1530", 2: "#10204a" },
        line: "rgba(255,255,255,0.09)",
        fg: "#f2f5fb",
        muted: "#9ba8c2",
        accent: { DEFAULT: "#c8102e", hi: "#ef4056", lo: "#9a0b26" },
        navy: { DEFAULT: "#00205b", light: "#0a3a8c" },
      },
      fontFamily: { sans: ["var(--font-inter)", "system-ui", "sans-serif"] },
      letterSpacing: { tightest: "-0.04em" },
    },
  },
  plugins: [],
} satisfies Config;
