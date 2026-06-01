import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#60A5FA",
        primary: {
          DEFAULT: "#60A5FA",
          foreground: "#ffffff",
        },
        background: "#080808",
        foreground: "#ffffff",
        card: "#0F0F0F",
        secondary: "rgba(255, 255, 255, 0.1)",
        muted: "rgba(255, 255, 255, 0.5)",
        accent: "rgba(255, 255, 255, 0.1)",
        border: "rgba(255, 255, 255, 0.06)",
        input: "rgba(255, 255, 255, 0.08)",
        ring: "#60A5FA",
        destructive: "#ff3b1f",
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
