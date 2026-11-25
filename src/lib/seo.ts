// Datos estructurados (schema.org) a partir del contenido editable.
// Ayudan a Google y a los modelos de IA a entender quiénes son, dónde están y cómo contactarlos.
import { sitio, esPendiente, type Local } from './contenido';

const valor = (v: string) => (esPendiente(v) ? undefined : v.trim());

function restaurante(local: Local) {
  const direccion = valor(local.direccion);
  const redes = [valor(local.instagram), valor(local.facebook)].filter(Boolean);
  return {
    '@type': 'Restaurant',
    name: local.nombre,
    description: valor(local.descripcion),
    telephone: valor(local.telefono),
    hasMenu: valor(local.menu),
    sameAs: redes.length ? redes : undefined,
    address: direccion
      ? {
          '@type': 'PostalAddress',
          streetAddress: direccion.split(',')[0].trim(),
          addressLocality: sitio.ciudad,
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
    subOrganization: sitio.locales.map(restaurante),
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
