// @ts-check
import { defineConfig } from 'astro/config';
import sitio from './src/contenido/sitio.json' with { type: 'json' };

// El dominio se carga desde el panel ("Datos del grupo" → "Dominio de la web").
// Mientras siga entre corchetes no hay URL absoluta: el sitio funciona igual,
// pero el sitemap queda vacío y no hay URLs canónicas.
const dominio = sitio.dominio.trim().replace(/^https?:\/\//, '').replace(/\/+$/, '');
const site = dominio && !dominio.startsWith('[') ? `https://${dominio}` : undefined;

// Sitio 100% estático: Cloudflare Pages sirve la carpeta dist/ tal cual.
export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    // /menus queda como /menus/index.html: Cloudflare lo sirve en /menus.
    format: 'directory',
  },
});
