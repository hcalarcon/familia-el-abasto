// @ts-check
import { defineConfig } from 'astro/config';

// Sitio 100% estático: Cloudflare Pages sirve la carpeta dist/ tal cual.
// Cuando el cliente confirme el dominio, completar `site` (sirve para
// las URLs canónicas y el sitemap): por ejemplo 'https://[dominio]'.
export default defineConfig({
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    // /menus queda como /menus/index.html: Cloudflare lo sirve en /menus.
    format: 'directory',
  },
});
