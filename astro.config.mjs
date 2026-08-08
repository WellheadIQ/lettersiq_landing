import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from "@astrojs/tailwind";
import partytown from "@astrojs/partytown";
import { site } from './src/data/site.js';

export default defineConfig({
  site: site.url,
  trailingSlash: 'never',
  integrations: [react(), tailwind(), [partytown()]],
  vite: {
    assetsInclude: ['**/*.png']
  }
});
