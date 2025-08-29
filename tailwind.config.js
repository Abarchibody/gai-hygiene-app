/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'gai-blue': '#007cba',
        'gai-green': '#28a745',
        'gai-orange': '#fd7e14'
      }
    },
  },
  plugins: [],
}