import scrollbarHide from "tailwind-scrollbar-hide";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      Montserrat: ['Montserrat', 'sans-serif'],
      Poppins: ['Poppins', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [scrollbarHide],
};

export default config;
