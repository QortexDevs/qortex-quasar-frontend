/** @type {import('tailwindcss').Config} */

const { brandColors, colorClassesSafeList } = require('./src/services/colorsConfig')

module.exports = {
  content: ['./src/**/*.{html,js,vue}'],
  safelist: [
    ...colorClassesSafeList
  ],
  theme: {
    extend: {
      colors: brandColors
    }
  },
  plugins: []
}
