// Lista de todas las direcciones publicadas: la usan el sitemap y llms.txt.
import { sitio, esPendiente, linkMapa, linkDeMenu, type Local } from './contenido';
import { obtenerPaginas, obtenerNotas, fechaISO } from './publicaciones';
import { obtenerCarta, rutaDeCarta, textoPrecio, type Carta } from './carta';

export interface Entrada {
  ruta: string;
  titulo: string;
  descripcion: string;
  fecha?: string;
  tipo: 'principal' | 'pagina' | 'nota';
  cuerpo?: string;
}

/** Carta en Markdown para llms-full.txt: categorías como ###, un plato por línea. */
function cartaEnMarkdown(carta: Carta): string {
  return carta.categorias
    .map((categoria) => {
      const descripcion = categoria.descripcion?.trim() ? `${categoria.descripcion.trim()}\n\n` : '';
      const platos = categoria.platos
        .map((p) => {
          const detalle = p.descripcion?.trim() ? `: ${p.descripcion.trim()}` : '';
          return `- ${p.nombre} — ${textoPrecio(p.precio)}${p.agotado ? ' (agotado)' : ''}${detalle}`;
        })
        .join('\n');
      return `### ${categoria.nombre}\n\n${descripcion}${platos}`;
    })
    .join('\n\n');
}

/**
 * Una entrada por cada local con carta propia en la web (ej. /barricas).
 * Si smaalacarta falla en el build, obtenerCarta corta el build: no se atrapa el error acá.
 */
async function entradasDeCartas(): Promise<Entrada[]> {
  const conCarta = sitio.locales.flatMap((local) => {
    const ruta = rutaDeCarta(local.cartaSlug);
    return ruta ? [{ local, ruta }] : [];
  });
  return Promise.all(
    conCarta.map(async ({ local, ruta }) => {
      const carta = await obtenerCarta(local.cartaSlug.trim());
      return {
        ruta,
        titulo: `Carta de ${local.nombre}`,
        descripcion: `Platos y precios de ${local.nombre}${esPendiente(local.ciudad) ? '' : ` en ${local.ciudad.trim()}`}.`,
        tipo: 'principal' as const,
        cuerpo: cartaEnMarkdown(carta),
      };
    }),
  );
}

export async function obtenerIndice(): Promise<Entrada[]> {
  const [paginas, notas, cartasInternas] = await Promise.all([obtenerPaginas(), obtenerNotas(), entradasDeCartas()]);
  return [
    { ruta: '/', titulo: sitio.nombre, descripcion: sitio.historia, tipo: 'principal' },
    { ruta: '/cartas', titulo: 'Cartas de los tres locales', descripcion: `Cartas, teléfonos y reservas de ${sitio.locales.map((l) => l.nombre).join(', ')}.`, tipo: 'principal' },
    ...cartasInternas,
    ...paginas.map((p) => ({ ruta: `/${p.id}`, titulo: p.data.titulo, descripcion: p.data.descripcion, tipo: 'pagina' as const, cuerpo: p.body })),
    ...(notas.length ? [{ ruta: '/blog', titulo: 'Blog', descripcion: `Notas de ${sitio.nombre}.`, tipo: 'principal' as const }] : []),
    ...notas.map((n) => ({ ruta: `/blog/${n.id}`, titulo: n.data.titulo, descripcion: n.data.descripcion, fecha: fechaISO(n.data.fecha), tipo: 'nota' as const, cuerpo: n.body })),
  ];
}

/** URL absoluta si el dominio está cargado; si no, la ruta sola. */
export function absoluta(ruta: string, site?: URL): string {
  return site ? new URL(ruta, site).href : ruta;
}

/** Link de la carta: si es una ruta del sitio ("/barricas") se completa con el dominio. */
function absolutaSiInterna(link: string | null, site?: URL): string {
  if (!link) return '';
  return link.startsWith('/') ? absoluta(link, site) : link;
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
export function datosDeLocales(site?: URL): string {
  return sitio.locales
    .map((l) => {
      const datos = [
        ['Dirección', direccionCompleta(l)],
        ['Teléfono', l.telefono],
        ['Horario', l.horario],
        ['Menú', absolutaSiInterna(linkDeMenu(l), site)],
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
