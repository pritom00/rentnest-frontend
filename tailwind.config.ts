import type { Config } from "tailwindcss";

// RentNest design system — "Ledger & Plaque": a black-ink-on-paper editorial
// language borrowed from building directories, brass door plaques, and
// architectural drawings. Zero border-radius, hairline rules, a single
// restrained "stamp red" accent reserved for errors/rejections.
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0A0A0A",
          700: "#2B2B2B",
          500: "#5C5C58",
          300: "#8C8C86",
        },
        paper: {
          50: "#FAFAF7",
          100: "#F1F0EA",
          200: "#E5E3DA",
        },
        line: "#D8D6CC",
        stamp: {
          DEFAULT: "#A32619",
          50: "#FBEEEC",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        none: "0px",
        DEFAULT: "0px",
      },
      letterSpacing: {
        tightest: "-0.03em",
        widest2: "0.18em",
      },
      boxShadow: {
        none: "none",
        card: "0 1px 0 0 #0A0A0A",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
