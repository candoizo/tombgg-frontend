/* eslint-env node */
module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.html', './src/**/*.svelte'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        xs: '400px'
      }
    }
  },
  variants: {
    extend: {}
  }
  // plugins: [tailwindcssforms]
};
