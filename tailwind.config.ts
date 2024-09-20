import type { Config } from "tailwindcss";
import {nextui} from "@nextui-org/react";
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "blue-text-title": "#243757"
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
