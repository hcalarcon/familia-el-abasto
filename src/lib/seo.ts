// Datos estructurados (schema.org) a partir del contenido editable.
// Ayudan a Google y a los modelos de IA a entender quiénes son, dónde están y cómo contactarlos.
import { sitio, esPendiente, linkMapa, linkTelefono, type Local } from './contenido';

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

function restaurante(local: Local, site?: URL) {
  const direccion = valor(local.direccion);
  const redes = [valor(local.instagram), valor(local.facebook)].filter(Boolean);
  const foto = valor(local.foto);
  const tel = linkTelefono(local.telefono);
  // La ficha de cada local está en /cartas.
  const ficha = site ? new URL('/cartas', site).href : undefined;
  return {
    '@type': 'Restaurant',
    '@id': ficha ? `${ficha}#${slug(local.nombre)}` : undefined,
    name: local.nombre,
    url: ficha,
    description: valor(local.descripcion),
    image: foto && site ? new URL(foto, site).href : undefined,
    telephone: tel ? tel.replace('tel:', '') : undefined,
    hasMenu: valor(local.menu),
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
