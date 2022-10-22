/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      "yellow-banana": "#FEDA1E",
    },
    extend: {
      spacing: {
        "150vw": "150vw",
      },
    },
  },
  plugins: [],
};
