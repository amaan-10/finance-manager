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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    screens: {
      // Custom breakpoints
      xs: "340px", // Extra small devices
      sm: "460px", // Small devices
      md: "810px", // Medium devices (Tablets)
      lg: "1080px", // Large devices (Laptops)
      xl: "1280px", // Extra large devices (Desktops)
      "2xl": "1600px", // Super wide screens

      // Adding a custom "portrait mode" breakpoint
      portrait: { raw: "(orientation: portrait)" },
    },
  },
  plugins: [],
};
export default config;
