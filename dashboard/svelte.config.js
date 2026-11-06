import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '404.html'
    }),
    paths: {
      // Address of the site below its domain. On GitHub Pages a project site lives at
      // https://<user>.github.io/<repository>/, so the GitHub Action sets BASE_PATH to
      // "/<repository>". Locally it is empty.
      base: process.env.BASE_PATH ?? ''
    }
  }
};

export default config;
