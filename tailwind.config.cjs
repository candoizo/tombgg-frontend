/* eslint-env node */
// const tailwindcssforms = require('@tailwindcss/forms');
module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{html, svelte}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  }
  // plugins: [tailwindcssforms]
};
