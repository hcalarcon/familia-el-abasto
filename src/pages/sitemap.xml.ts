// Sitemap para Google. Necesita el dominio cargado en el panel: sin dominio queda vacío.
import type { APIRoute } from 'astro';
import { obtenerIndice } from '../lib/indice';

const escapar = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async ({ site }) => {
  const entradas = site ? await obtenerIndice() : [];
  const urls = entradas
    .map((e) => `  <url><loc>${escapar(new URL(e.ruta, site).href)}</loc>${e.fecha ? `<lastmod>${e.fecha}</lastmod>` : ''}</url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
