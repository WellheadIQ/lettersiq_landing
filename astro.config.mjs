import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from "@astrojs/tailwind";
import partytown from "@astrojs/partytown";

export default defineConfig({
  site: 'https://lettersiq.com',
  trailingSlash: 'never',
  integrations: [react(), tailwind(), [partytown()]],
  vite: {
    assetsInclude: ['**/*.png']
  }
});
