/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      "yellow-banana": "#FEDA1E",
      "green-success": "#2BC253",
      "orange-warning": "#FCBA03",
      black: "#000",
      transparent: "transparent",
    },
    extend: {
      spacing: {
        "150vw": "150vw",
      },
    },
  },
  plugins: [],
};
