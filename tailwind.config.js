/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        btn: "#32854e",
        dark: "#0D0A0A",
        shadow: "#2A2525",
      },
      container: {
        center: true,
        padding: "1rem",
      },
    },
  },
  plugins: [require("daisyui")],
};
