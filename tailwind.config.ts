import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./{app,components,features,hooks,lib,styles,types}/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f1f4ff",
          100: "#e6ebff",
          200: "#ccd6ff",
          300: "#aebfff",
          400: "#899fe6",
          500: "#5a74c8",
          600: "rgb(6,12,58)",
          700: "#050933",
          800: "#04072b",
          900: "#030522",
          950: "#020318"
        }
      }
    }
  },
  plugins: []
};

export default config;



