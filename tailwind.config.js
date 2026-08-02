/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        colgate: {
          red: "#C8102E",
          "red-dark": "#9E0C24",
          blue: "#005EB8",
          "blue-dark": "#004A93",
          graphite: "#1F2937",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(31, 41, 55, 0.08), 0 1px 2px -1px rgba(31, 41, 55, 0.06)",
        "card-hover": "0 4px 12px -2px rgba(31, 41, 55, 0.12)",
      },
    },
  },
  plugins: [],
};
