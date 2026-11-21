// llms.txt: resumen del sitio pensado para modelos de IA (https://llmstxt.org).
import type { APIRoute } from 'astro';
import { sitio } from '../lib/contenido';
import { obtenerIndice, absoluta, datosDeLocales } from '../lib/indice';

export const GET: APIRoute = async ({ site }) => {
  const indice = await obtenerIndice();
  const lista = (tipo: string) =>
    indice
      .filter((e) => e.tipo === tipo)
      .map((e) => `- [${e.titulo}](${absoluta(e.ruta, site)}): ${e.descripcion}`)
      .join('\n');

  const secciones = [
    `# ${sitio.nombre}`,
    `> ${sitio.historia} Restaurantes en ${sitio.ciudad}, Neuquén, Argentina.`,
    `## Locales\n\n${datosDeLocales()}`,
    `## Páginas principales\n\n${lista('principal')}`,
  ];
  const paginas = lista('pagina');
  if (paginas) secciones.push(`## Páginas\n\n${paginas}`);
  const notas = lista('nota');
  if (notas) secciones.push(`## Blog\n\n${notas}`);
  secciones.push(`## Optional\n\n- [Texto completo del sitio](${absoluta('/llms-full.txt', site)}): todas las páginas y notas en un solo archivo.`);

  return new Response(secciones.join('\n\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
