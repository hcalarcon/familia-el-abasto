// Datos estructurados (schema.org) a partir del contenido editable.
// Ayudan a Google y a los modelos de IA a entender quiénes son, dónde están y cómo contactarlos.
import { sitio, esPendiente, linkMapa, linkTelefono, type Local } from './contenido';

const valor = (v: string) => (esPendiente(v) ? undefined : v.trim());

function restaurante(local: Local, site?: URL) {
  const direccion = valor(local.direccion);
  const redes = [valor(local.instagram), valor(local.facebook)].filter(Boolean);
  const foto = valor(local.foto);
  const tel = linkTelefono(local.telefono);
  return {
    '@type': 'Restaurant',
    name: local.nombre,
    description: valor(local.descripcion),
    image: foto && site ? new URL(foto, site).href : undefined,
    telephone: tel ? tel.replace('tel:', '') : undefined,
    hasMenu: valor(local.menu),
    hasMap: linkMapa(local) ?? undefined,
    acceptsReservations: tel ? 'True' : undefined,
    sameAs: redes.length ? redes : undefined,
    address: direccion
      ? {
          '@type': 'PostalAddress',
          streetAddress: direccion.split(',')[0].trim(),
          addressLocality: sitio.ciudad,
          postalCode: 'Q8370',
          addressRegion: 'Neuquén',
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
