// Única puerta de entrada al contenido editable (src/contenido/*.json).
// Los componentes nunca leen los JSON directamente: siempre pasan por acá.
import sitioJson from '../contenido/sitio.json';
import enConstruccionJson from '../contenido/en-construccion.json';

export interface Local {
  nombre: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  horario: string;
  menu: string;
  zapan: string;
  instagram: string;
  facebook: string;
}

export interface Sitio {
  nombre: string;
  ciudad: string;
  dominio: string;
  historia: string;
  locales: Local[];
}

export interface EnConstruccion {
  titulo: string;
  tituloMenus: string;
  subtitulo: string;
  mensaje: string;
}

export const sitio: Sitio = sitioJson;
export const enConstruccion: EnConstruccion = enConstruccionJson;

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
