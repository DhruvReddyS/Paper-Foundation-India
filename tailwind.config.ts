import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "paper-white": "#FAF8F5",
        "paper-warm": "#F2EDE7",
        kraft: "#E8DDD0",
        forest: "#2D5F3E",
        "forest-light": "#3A7A50",
        sage: "#8B9D77",
        copper: "#C4956A",
        charcoal: "#2C2C2C",
        "mid-grey": "#6B6B6B",
        border: "#E0DAD2",
        "dark-green": "#244D32",
      },
      fontFamily: {
        serif: ["var(--font-cormorant-garamond)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "DM Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-dm-mono)", "DM Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
