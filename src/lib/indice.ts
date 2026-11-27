// Lista de todas las direcciones publicadas: la usan el sitemap y llms.txt.
import { sitio, esPendiente, linkMapa, type Local } from './contenido';
import { obtenerPaginas, obtenerNotas, fechaISO } from './publicaciones';

export interface Entrada {
  ruta: string;
  titulo: string;
  descripcion: string;
  fecha?: string;
  tipo: 'principal' | 'pagina' | 'nota';
  cuerpo?: string;
}

export async function obtenerIndice(): Promise<Entrada[]> {
  const [paginas, notas] = await Promise.all([obtenerPaginas(), obtenerNotas()]);
  return [
    { ruta: '/', titulo: sitio.nombre, descripcion: sitio.historia, tipo: 'principal' },
    { ruta: '/cartas', titulo: 'Cartas de los tres locales', descripcion: `Cartas, teléfonos y reservas de ${sitio.locales.map((l) => l.nombre).join(', ')}.`, tipo: 'principal' },
    ...paginas.map((p) => ({ ruta: `/${p.id}`, titulo: p.data.titulo, descripcion: p.data.descripcion, tipo: 'pagina' as const, cuerpo: p.body })),
    ...(notas.length ? [{ ruta: '/blog', titulo: 'Blog', descripcion: `Notas de ${sitio.nombre}.`, tipo: 'principal' as const }] : []),
    ...notas.map((n) => ({ ruta: `/blog/${n.id}`, titulo: n.data.titulo, descripcion: n.data.descripcion, fecha: fechaISO(n.data.fecha), tipo: 'nota' as const, cuerpo: n.body })),
  ];
}

/** URL absoluta si el dominio está cargado; si no, la ruta sola. */
export function absoluta(ruta: string, site?: URL): string {
  return site ? new URL(ruta, site).href : ruta;
}

/** Dirección con la ciudad del local, si no la incluye ya. */
function direccionCompleta(l: Local): string {
  if (esPendiente(l.direccion)) return '';
  const direccion = l.direccion.trim();
  const ciudad = esPendiente(l.ciudad) ? '' : l.ciudad.trim();
  if (!ciudad || direccion.toLowerCase().includes(ciudad.toLowerCase())) return direccion;
  return `${direccion}, ${ciudad}`;
}

/** Datos de los locales en Markdown, para llms.txt y llms-full.txt. */
export function datosDeLocales(): string {
  return sitio.locales
    .map((l) => {
      const datos = [
        ['Dirección', direccionCompleta(l)],
        ['Teléfono', l.telefono],
        ['Horario', l.horario],
        ['Menú', l.menu],
        ['Pedidos (Zapan)', l.zapan],
        ['Mapa', linkMapa(l) ?? ''],
        ['Instagram', l.instagram],
        ['Facebook', l.facebook],
      ]
        // esPendiente también descarta vacíos: no salen líneas "- Facebook: " sin dato.
        .filter(([, v]) => !esPendiente(v))
        .map(([k, v]) => `- ${k}: ${v.trim()}`);
      const descripcion = esPendiente(l.descripcion) ? '' : `${l.descripcion.trim()}\n\n`;
      return `### ${l.nombre}\n\n${descripcion}${datos.join('\n')}`;
    })
    .join('\n\n');
}
