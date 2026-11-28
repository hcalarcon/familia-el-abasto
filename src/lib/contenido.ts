// Única puerta de entrada al contenido editable (src/contenido/*.json).
// Los componentes nunca leen los JSON directamente: siempre pasan por acá.
import sitioJson from '../contenido/sitio.json';
import enConstruccionJson from '../contenido/en-construccion.json';
import cartasJson from '../contenido/cartas.json';
import { rutaDeCarta } from './carta';

export interface Local {
  nombre: string;
  /** Nombre corto para los botones de redes ("Las Barricas"). */
  nombreCorto: string;
  /** Línea que se ve en la tarjeta del local. */
  linea: string;
  /** Descripción para Google y modelos de IA. */
  descripcion: string;
  direccion: string;
  /** Ciudad del local ("San Martín de los Andes"). Si falta, se usa la ciudad del grupo. */
  ciudad: string;
  /** Provincia del local ("Neuquén"). */
  provincia: string;
  /** Código postal del local ("Q8370"). */
  codigoPostal: string;
  /** Link de Google Maps. Si queda vacío se arma solo con el nombre y la dirección. */
  mapa: string;
  telefono: string;
  /** Horario como se lee en la web ("Todos los días de 12 a 00 h"). */
  horario: string;
  /**
   * Horario para Google, en formato schema.org. Ej. "Mo-Su 12:00-24:00".
   * Si no respeta el formato no se publica.
   */
  horarioSchema: string;
  foto: string;
  fotoAlt: string;
  logo: string;
  logoAlt: string;
  /** "Ver menú" o "Ver carta". */
  textoMenu: string;
  menu: string;
  /**
   * Slug de la carta en smaalacarta ("las-barricas-del-abasto").
   * Si tiene, "Ver carta" lleva a la página interna de la carta (ej. /barricas) en vez de `menu`.
   */
  cartaSlug: string;
  zapan: string;
  instagram: string;
  facebook: string;
}

export interface Sitio {
  nombre: string;
  ciudad: string;
  dominio: string;
  lema: string;
  firma: string;
  logo: string;
  logoAlt: string;
  historia: string;
  locales: Local[];
}

export interface EnConstruccion {
  aviso: string;
  botonCartas: string;
  linkCartas: string;
}

/** Textos de /cartas, la entrada del QR. */
export interface Cartas {
  tituloRedes: string;
  tituloLocales: string;
  historiaTitulo: string;
  historiaBajada: string;
  historiaLink: string;
  webTitulo: string;
  webBajada: string;
  webLink: string;
}

export const sitio: Sitio = sitioJson;
export const enConstruccion: EnConstruccion = enConstruccionJson;
export const cartas: Cartas = cartasJson;

/** Un dato entre corchetes es un dato que todavía falta confirmar. */
export function esPendiente(valor: string | undefined): boolean {
  return !valor || valor.trim().startsWith('[');
}

/**
 * Arma el link tel: a partir del teléfono tal como se muestra.
 * "(02972) 42-1454" -> "tel:+542972421454". Devuelve null si el dato falta.
 */
export function linkTelefono(telefono: string): string | null {
  if (esPendiente(telefono)) return null;
  let digitos = telefono.replace(/\D/g, '');
  // Si ya viene con código de país ("+54 9 2972 ..."), se usa tal cual.
  if (telefono.trim().startsWith('+')) return digitos.length >= 10 ? `tel:+${digitos}` : null;
  digitos = digitos.replace(/^0/, '');
  if (digitos.length < 8) return null;
  return `tel:+54${digitos}`;
}

/**
 * Link a Google Maps del local: el cargado en el panel o, si no hay,
 * una búsqueda por nombre y dirección. Devuelve null si falta la dirección.
 */
export function linkMapa(local: Local): string | null {
  if (!esPendiente(local.mapa)) return local.mapa.trim();
  if (esPendiente(local.direccion)) return null;
  const consulta = `${local.nombre}, ${local.direccion}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta)}`;
}

/**
 * A dónde lleva "Ver carta" / "Ver menú": la página interna de la carta si el local
 * tiene `cartaSlug` (ej. "/barricas"); si no, el link de `menu`. null si no hay ninguno.
 */
export function linkDeMenu(local: Local): string | null {
  const interna = rutaDeCarta(local.cartaSlug);
  if (interna) return interna;
  return esPendiente(local.menu) ? null : local.menu.trim();
}
