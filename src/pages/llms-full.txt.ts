// llms-full.txt: todo el texto del sitio en un solo archivo, para modelos de IA.
import type { APIRoute } from 'astro';
import { sitio } from '../lib/contenido';
import { obtenerIndice, absoluta, datosDeLocales } from '../lib/indice';

export const GET: APIRoute = async ({ site }) => {
  const conTexto = (await obtenerIndice()).filter((e) => e.cuerpo?.trim());
  const partes = [
    `# ${sitio.nombre}`,
    `> ${sitio.historia}`,
    `## Locales\n\n${datosDeLocales(site)}`,
    ...conTexto.map(
      (e) => `---\n\n## ${e.titulo}\n\nURL: ${absoluta(e.ruta, site)}${e.fecha ? `\nFecha: ${e.fecha}` : ''}\n\n${e.cuerpo!.trim()}`,
    ),
  ];
  return new Response(partes.join('\n\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
