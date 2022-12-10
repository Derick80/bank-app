/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"
],
darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {fontFamily: {
        Condensed: ['Roboto Condensed', 'sans-serif'],
        Eczar: ['Eczar', 'serif']
      }},
  },
  plugins: [    require('@tailwindcss/typography'),    require('@tailwindcss/forms'),

],
}
