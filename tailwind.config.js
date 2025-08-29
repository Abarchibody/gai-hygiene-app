/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,php}"],
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