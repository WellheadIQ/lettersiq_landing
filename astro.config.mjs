import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import partytown from "@astrojs/partytown";
import { site } from './src/data/site.js';

export default defineConfig({
  site: site.url,
  trailingSlash: 'never',
  integrations: [react(), [partytown()]],
  vite: {
    assetsInclude: ['**/*.png']
  }
});
