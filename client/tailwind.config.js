// tailwind.config.js
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          playfair: ['playfair', 'cursive'],
          inter: ['Inter', 'sans-serif'],
        }
      }
    },
    plugins: [],
  }
  