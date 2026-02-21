import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0a0a0a",
          card: "rgba(255,255,255,0.03)",
          panel: "rgba(255,255,255,0.04)",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.08)",
          strong: "rgba(255,255,255,0.12)",
        },
        text: {
          secondary: "rgba(255,255,255,0.7)",
          tertiary: "rgba(255,255,255,0.45)",
        },
        accent: {
          DEFAULT: "#00ff88",
          dim: "rgba(0,255,136,0.15)",
          muted: "rgba(0,255,136,0.4)",
        },
      },
      fontFamily: {
        sans: ["var(--font-pretendard)", "Pretendard", "system-ui", "sans-serif"],
      },
      backdropBlur: {
        xs: "2px",
        glass: "12px",
        "glass-strong": "24px",
      },
      animation: {
        "fade-in": "fadeIn 0.35s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
