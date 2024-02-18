const STANDARD_COLORS = {
  primary: '#1976D2',
  secondary: '#26A69A',
  accent: '#9C27B0',
  dark: '#1D1D1D',
  positive: '#21BA45',
  negative: '#C10015',
  info: '#31CCEC',
  warning: '#F2C037'
}

const CUSTOM_COLORS = {
  transparent: 'transparent',
  test: '#371F76'
}

const brandColors = {
  ...STANDARD_COLORS,
  ...CUSTOM_COLORS
}

const colorClassesSafeList = Object.keys(CUSTOM_COLORS).flatMap((color) => {
  return [`bg-${color}`, `text-${color}`]
})

module.exports = { STANDARD_COLORS, CUSTOM_COLORS, brandColors, colorClassesSafeList }
