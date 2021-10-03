const tailwind = require('tailwindcss');

module.exports = async ({ env }) => {
  return {
    plugins: [tailwind]
  };
};
