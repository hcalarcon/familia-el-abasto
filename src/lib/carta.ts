// Carta de Las Barricas.
// Hoy los datos salen de src/contenido/carta-barricas.json (editable desde Pages CMS).
// Más adelante vendrán del panel de Zapan: sólo hay que cambiar obtenerCarta(),
// los componentes que muestran la carta no se tocan.
import cartaJson from '../contenido/carta-barricas.json';

export interface Plato {
  nombre: string;
  descripcion?: string;
  /** Vacío o ausente: se muestra "Consultar". */
  precio?: string;
}

export interface Grupo {
  titulo?: string;
  platos: Plato[];
}

export interface Categoria {
  nombre: string;
  nota?: string;
  grupos: Grupo[];
}

export interface Carta {
  categorias: Categoria[];
}

export async function obtenerCarta(): Promise<Carta> {
  return cartaJson as Carta;
}

export function textoPrecio(precio?: string): string {
  return precio && precio.trim() ? precio.trim() : 'Consultar';
}
