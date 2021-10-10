/* eslint-env node */
import vercel from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';
import image from 'svelte-image';
import { terser } from 'rollup-plugin-terser';

export default {
  pages: {
    entry: 'src/app.pug'
  },
  preprocess: preprocess({
    postcss: true,
    defaults: {
      style: 'postcss'
    },
    ...image()
  }),
  kit: {
    adapter: vercel(),
    target: '#svelte',
    vite: {
      plugins: [
        terser({
          // format: {
          //   comments: false
          // },
          compress: {
            drop_console: process.env.NODE_ENV !== 'development'
          }
        })
      ]
    }
  },
  devServer: {
    port: 3030
  }
};
