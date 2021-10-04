/* eslint-env node */
module.exports = {
  parser: '@typescript-eslint/parser', // add the TypeScript parser
  parserOptions: {
    sourceType: 'module'
  },
  plugins: [
    'svelte3',
    '@typescript-eslint' // add the TypeScript plugin
  ],
  overrides: [
    // this stays the same
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3'
    },
    {
      files: ['*.cjs', 'svelte.config.js']
      // parser: 'espree'
      // processor: 'svelte3/svelte3'
    }
  ],
  rules: {
    // ...
    '@typescript-eslint/explicit-module-boundary-types': 'off'
  },
  settings: {
    'svelte3/typescript': true // load TypeScript as peer dependency
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  env: {
    browser: true,
    es2021: true
  }
};
