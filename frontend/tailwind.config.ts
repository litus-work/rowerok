import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#ea580c",
          dark: "#c2410c"
        }
      }
    }
  },
  plugins: []
};

export default config;
