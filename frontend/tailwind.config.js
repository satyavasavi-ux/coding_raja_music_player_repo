/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#05070e",
          card: "rgba(13, 19, 36, 0.75)",
          border: "rgba(59, 130, 246, 0.2)",
          neon: "#38bdf8",
          purple: "#a855f7",
          pink: "#ec4899",
          emerald: "#10b981",
        }
      }
    },
  },
  plugins: [],
}
