// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// PrimeTrack Nigeria — static output only.
// Trailing slashes and directory build format keep every URL byte-identical to
// the live WordPress site (see docs/information-architecture.md §1).
export default defineConfig({
  site: 'https://www.primetracknigeria.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    react(),
    sitemap({
      // The design-system reference page is for the team, not for search engines.
      filter: (page) => !page.includes('/design-system'),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
