/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'secondary': ['Montserrat', 'sans-serif'],
        'primary': ['Open Sans', 'sans-serif'],
        'happiness': ['Josefin Sans', 'sans-serif'],
      }
    }
  },
  plugins: [],
}

