// Se permite a todos los buscadores y modelos de IA leer el sitio: la idea es que lo conozcan.
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const lineas = ['User-agent: *', 'Allow: /', ''];
  if (site) lineas.push(`Sitemap: ${new URL('/sitemap.xml', site).href}`, '');
  return new Response(lineas.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
