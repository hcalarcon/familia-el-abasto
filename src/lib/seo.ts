// Datos estructurados (schema.org) a partir del contenido editable.
// Ayudan a Google y a los modelos de IA a entender quiénes son, dónde están y cómo contactarlos.
import { sitio, esPendiente, linkMapa, linkTelefono, type Local } from './contenido';
import { rutaDeCarta, type Carta } from './carta';

const valor = (v: string | undefined) => (esPendiente(v) ? undefined : v!.trim());

// Horario en formato schema.org: "Mo-Su 11:00-24:00", "Mo,We 09:00-13:00".
// Varios grupos se separan con coma: "Mo-Fr 12:00-16:00, Sa-Su 12:00-24:00".
const DIA = '(?:Mo|Tu|We|Th|Fr|Sa|Su)';
const DIAS = `${DIA}(?:-${DIA})?(?:,${DIA}(?:-${DIA})?)*`;
const HORA = '(?:(?:[01]\\d|2[0-3]):[0-5]\\d|24:00)';
const GRUPO = `${DIAS} ${HORA}-${HORA}`;
const HORARIO_SCHEMA = new RegExp(`^${GRUPO}(?:\\s*,\\s*${GRUPO})*$`);
const GRUPO_GLOBAL = new RegExp(GRUPO, 'g');

/** Devuelve el horario listo para schema.org, o undefined si no respeta el formato. */
function horarioSchema(v: string | undefined): string | string[] | undefined {
  const texto = valor(v)?.replace(/\s+/g, ' ');
  if (!texto || !HORARIO_SCHEMA.test(texto)) return undefined;
  const grupos = texto.match(GRUPO_GLOBAL) ?? [];
  return grupos.length === 1 ? grupos[0] : grupos;
}

/** "Las Barricas del Abasto" -> "las-barricas-del-abasto", para el @id. */
function slug(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** La ficha de cada local está en /cartas. */
const fichaDeLocal = (site?: URL) => (site ? new URL('/cartas', site).href : undefined);

/** @id del Restaurant ("https://.../cartas#las-barricas-del-abasto"), el mismo en todas las páginas. */
function idDeRestaurante(local: Local, site?: URL): string | undefined {
  const ficha = fichaDeLocal(site);
  return ficha ? `${ficha}#${slug(local.nombre)}` : undefined;
}

/** URL absoluta de la carta del local: la página interna si tiene carta propia, si no el link de "menu". */
function urlDeMenu(local: Local, site?: URL): string | undefined {
  const interna = rutaDeCarta(local.cartaSlug);
  if (interna) return site ? new URL(interna, site).href : undefined;
  return valor(local.menu);
}

function restaurante(local: Local, site?: URL) {
  const direccion = valor(local.direccion);
  const redes = [valor(local.instagram), valor(local.facebook)].filter(Boolean);
  const foto = valor(local.foto);
  const tel = linkTelefono(local.telefono);
  return {
    '@type': 'Restaurant',
    '@id': idDeRestaurante(local, site),
    name: local.nombre,
    url: fichaDeLocal(site),
    description: valor(local.descripcion),
    image: foto && site ? new URL(foto, site).href : undefined,
    telephone: tel ? tel.replace('tel:', '') : undefined,
    hasMenu: urlDeMenu(local, site),
    hasMap: linkMapa(local) ?? undefined,
    openingHours: horarioSchema(local.horarioSchema),
    acceptsReservations: tel ? true : undefined,
    sameAs: redes.length ? redes : undefined,
    address: direccion
      ? {
          '@type': 'PostalAddress',
          streetAddress: direccion.split(',')[0].trim(),
          // Cada local tiene su ciudad; la del grupo queda sólo de respaldo.
          addressLocality: valor(local.ciudad) ?? valor(sitio.ciudad),
          addressRegion: valor(local.provincia),
          postalCode: valor(local.codigoPostal),
          addressCountry: 'AR',
        }
      : undefined,
  };
}

/** Organización del grupo con sus tres restaurantes. Va en el inicio y en /cartas. */
export function datosDelGrupo(site?: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: sitio.nombre,
    description: sitio.historia,
    url: site?.href,
    subOrganization: sitio.locales.map((local) => restaurante(local, site)),
  };
}

/** Imagen absoluta: las de smaalacarta ya vienen completas; las del sitio se completan con el dominio. */
function imagenAbsoluta(foto: string | null, site?: URL): string | undefined {
  if (!foto?.trim()) return undefined;
  try {
    return new URL(foto.trim(), site).href;
  } catch {
    return undefined; // Ruta relativa sin dominio cargado.
  }
}

const texto = (v: string | null | undefined) => (v?.trim() ? v.trim() : undefined);

/**
 * Carta de un local como schema.org Menu (Menu → MenuSection → MenuItem → Offer).
 * Va en un @graph junto al Restaurant del local (mismo @id que en /cartas), con hasMenu → el Menu.
 */
export function datosDeCarta(carta: Carta, local: Local, site?: URL) {
  const ruta = rutaDeCarta(local.cartaSlug) ?? rutaDeCarta(carta.slug);
  const url = ruta && site ? new URL(ruta, site).href : undefined;
  const idMenu = url ? `${url}#carta` : undefined;
  const moneda = carta.moneda || 'ARS';

  const menu = {
    '@type': 'Menu',
    '@id': idMenu,
    name: `Carta de ${local.nombre}`,
    url,
    inLanguage: 'es-AR',
    hasMenuSection: carta.categorias.map((categoria) => ({
      '@type': 'MenuSection',
      name: categoria.nombre,
      description: texto(categoria.descripcion),
      hasMenuItem: categoria.platos.map((plato) => ({
        '@type': 'MenuItem',
        name: plato.nombre,
        description: texto(plato.descripcion),
        image: imagenAbsoluta(plato.foto, site),
        offers:
          typeof plato.precio === 'number' && Number.isFinite(plato.precio)
            ? {
                '@type': 'Offer',
                price: plato.precio,
                priceCurrency: moneda,
                availability: plato.agotado ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
              }
            : undefined,
      })),
    })),
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [{ ...restaurante(local, site), hasMenu: idMenu ? { '@id': idMenu } : url }, menu],
  };
}

export function datosDeNota(nota: { titulo: string; descripcion: string; fecha: string; url?: string; imagen?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: nota.titulo,
    description: nota.descripcion,
    datePublished: nota.fecha,
    url: nota.url,
    image: nota.imagen || undefined,
    inLanguage: 'es-AR',
    publisher: { '@type': 'Organization', name: sitio.nombre },
  };
}
