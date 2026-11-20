import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./{app,components,features,hooks,lib,styles,types}/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f1f5ff",
          100: "#e5edff",
          200: "#c7d7fe",
          300: "#93b4fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#1d70f2",
          700: "#155bd1",
          800: "#1047a8",
          900: "#0c3580",
          950: "#081c47"
        }
      }
    }
  },
  plugins: []
};

export default config;



