// @ts-check
import { defineConfig } from 'astro/config';

// Static site. Tailwind is wired in via postcss.config.mjs.
// Update `site` to your real domain once deployed.
export default defineConfig({
  site: 'https://carpenters-web.pages.dev',
});
