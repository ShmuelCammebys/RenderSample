/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "brand": {
          DEFAULT: "#1142d4",
          50: "#eff3fe",
          100: "#dae2fc",
          200: "#bccaf9",
          300: "#8fa8f5",
          400: "#5c7def",
          500: "#1142d4",
          600: "#2a46cc",
          700: "#2439a8",
          800: "#223188",
          900: "#202d6e",
          950: "#131a44",
        },
        "background-light": "#f6f6f8",
        "background-dark": "#101522",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
    },
  },
  plugins: [],
}
