// Acceso a las páginas y notas del blog que crea el admin.
// Los borradores nunca se publican.
import { getCollection, type CollectionEntry } from 'astro:content';

export type Pagina = CollectionEntry<'paginas'>;
export type Nota = CollectionEntry<'blog'>;

/**
 * Rutas que ya usa el sitio. Una página del admin no puede llamarse así,
 * porque taparía (o quedaría tapada por) una ruta fija. /menus va en el QR impreso.
 */
export const RUTAS_RESERVADAS = new Set([
  'menus', 'menu', 'qr', 'carta', 'barricas', 'blog', 'fotos', '404',
  'sitemap.xml', 'robots.txt', 'llms.txt', 'llms-full.txt',
]);

export async function obtenerPaginas(): Promise<Pagina[]> {
  const paginas = await getCollection('paginas', ({ data }) => !data.borrador);
  for (const pagina of paginas) {
    if (RUTAS_RESERVADAS.has(pagina.id) || pagina.id.includes('/')) {
      throw new Error(
        `La página "${pagina.data.titulo}" (archivo ${pagina.id}.md) usa una dirección reservada. ` +
          'Cambiale el nombre al archivo desde el panel.',
      );
    }
  }
  return paginas.sort((a, b) => a.data.orden - b.data.orden || a.data.titulo.localeCompare(b.data.titulo, 'es'));
}

export async function obtenerNotas(): Promise<Nota[]> {
  const notas = await getCollection('blog', ({ data }) => !data.borrador);
  return notas.sort((a, b) => b.data.fecha.getTime() - a.data.fecha.getTime());
}

export function formatearFecha(fecha: Date): string {
  return new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(fecha);
}

/** Fecha en formato AAAA-MM-DD, para el atributo datetime y los datos estructurados. */
export function fechaISO(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}
