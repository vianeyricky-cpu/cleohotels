import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Cukup satu baris ini, dia akan scan semua folder di dalam src
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#08111c",
          900: "#0b1c2c",
          800: "#13263d",
          700: "#1b3552",
          600: "#274466",
          500: "#37577a",
          200: "#d7dee9",
          100: "#e8edf4",
          50: "#f5f7fb",
        },
        gold: {
          500: "#b88b3a",
          400: "#c9a449",
          300: "#d8b866",
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
    },
  },
  plugins: [],
};
export default config;