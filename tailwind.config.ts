import type { Config } from "tailwindcss";
const { heroui } = require("@heroui/react");

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)"],
        code: ["var(--font-code)"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  darkMode: "selector",
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          background: "#FFF8F6",
          foreground: "#231918",
          primary: {
            50: "#faf5f2",
            100: "#f3e8e1",
            200: "#e6cfc2",
            300: "#d6b09b",
            400: "#c58a72",
            500: "#b97056",
            600: "#ab5d4b",
            700: "#904b40",
            800: "#743e38",
            900: "#5e3530",
            950: "#321a18",
            foreground: "#FFFFFF",
            DEFAULT: "#904B40"
          },
          secondary: {
            50: "#f5f3f1",
            100: "#e6dfdb",
            200: "#cfc1b9",
            300: "#b49a90",
            400: "#9e7c71",
            500: "#8f6c63",
            600: "#775651",
            700: "#634745",
            800: "#553e3f",
            900: "#4b3839",
            950: "#2a1e20",
            foreground: "#FFFFFF",
            DEFAULT: "#775651"
          },
          warning: {
            50: "#f8f9ed",
            100: "#edf0d1",
            200: "#dee2a6",
            300: "#cfd173",
            400: "#c2c04d",
            500: "#b3ac3f",
            600: "#9a8b34",
            700: "#7b692d",
            800: "#6f5c2e",
            900: "#5a4929",
            950: "#332715",
            foreground: "#FFFFFF",
            DEFAULT: "#6F5C2E"
          },
          danger: {
            50: "#fef2f2",
            100: "#fee2e2",
            200: "#ffc9c9",
            300: "#fda4a4",
            400: "#fa6f6f",
            500: "#f14242",
            600: "#de2424",
            700: "#ba1a1a",
            800: "#9b1919",
            900: "#801c1c",
            950: "#460909",
            foreground: "#FFFFFF",
            DEFAULT: "#BA1A1A"
          }
        }
      },
      dark: {
        colors: {
          background: "#1A1110",
          foreground: "#F1DFDB",
          primary: {
            50: "#fef4f2",
            100: "#ffe5e1",
            200: "#ffd0c8",
            300: "#ffb4a8",
            400: "#fd806c",
            500: "#f5573e",
            600: "#e23b20",
            700: "#be2e17",
            800: "#9d2917",
            900: "#82281a",
            950: "#471108",
            foreground: "#561E16",
            DEFAULT: "#FFB4A8"
          },
          secondary: {
            50: "#fbf6f5",
            100: "#f8eae8",
            200: "#f2dad6",
            300: "#e7bdb6",
            400: "#d99a90",
            500: "#c8786b",
            600: "#b25e50",
            700: "#954c40",
            800: "#7c4238",
            900: "#683b34",
            950: "#371c18",
            foreground: "#442925",
            DEFAULT: "#E7BDB6"
          },
          warning: {
            50: "#fef3f2",
            100: "#ffe4e1",
            200: "#ffcec8",
            300: "#ffb4ab",
            400: "#fd7c6c",
            500: "#f5523e",
            600: "#e23520",
            700: "#be2917",
            800: "#9d2517",
            900: "#82251a",
            950: "#470f08",
            foreground: "#690005",
            DEFAULT: "#FFB4AB"
          },
          danger: {
            50: "#fbf9f1",
            100: "#f6f0de",
            200: "#ecdebc",
            300: "#dec48c",
            400: "#d2a965",
            500: "#c89247",
            600: "#ba7d3c",
            700: "#9b6333",
            800: "#7d502f",
            900: "#654229",
            950: "#362114",
            foreground: "#3E2E04",
            DEFAULT: "#DEC48C"
          }
        }
      }
    }
  })],
} satisfies Config;
