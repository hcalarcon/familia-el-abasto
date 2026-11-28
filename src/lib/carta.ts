// Cartas que se traen de smaalacarta al compilar (hoy, la de Las Barricas).
// La carta se edita en smaalacarta, no en este repo.
//
// GET ${CARTAS_API}/api/cartas/<slug>.json
//   200 = carta · 404 {"error":"no-disponible"} = no publicada · 502 = falla de smaalacarta
//
// Si la API no responde 200:
//   - npm run build: el build falla con un mensaje claro (la web publicada queda como estaba).
//   - npm run dev: se usa src/contenido/carta-barricas.ejemplo.json y se avisa en consola.
import cartaEjemplo from '../contenido/carta-barricas.ejemplo.json';

export interface Plato {
  nombre: string;
  descripcion: string | null;
  /** En pesos, sin decimales. null = "Consultar". */
  precio: number | null;
  foto: string | null;
  agotado: boolean;
}

export interface Categoria {
  nombre: string;
  descripcion: string | null;
  platos: Plato[];
}

export interface Carta {
  slug: string;
  nombre: string;
  /** Hoy llega siempre null: no se muestra. */
  actualizado: string | null;
  moneda: string;
  categorias: Categoria[];
}

/** Página interna de cada carta. Un slug sin página acá no genera link (evita un 404). */
const RUTAS: Record<string, string> = {
  'las-barricas-del-abasto': '/barricas',
};

/** Ruta interna de la carta del local ("/barricas"), o null si no tiene. */
export function rutaDeCarta(cartaSlug: string | undefined): string | null {
  const slug = (cartaSlug ?? '').trim();
  return RUTAS[slug] ?? null;
}

const API_POR_DEFECTO = 'https://api.smaalacarta.com.ar';

function urlDeApi(): string {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  const base = (env?.CARTAS_API || import.meta.env.CARTAS_API || API_POR_DEFECTO).trim();
  return base.replace(/\/+$/, '');
}

const ejemplos: Record<string, Carta> = {
  'las-barricas-del-abasto': cartaEjemplo as Carta,
};

// Una sola llamada por slug en cada build (la usan /barricas, llms.txt y llms-full.txt).
const enCurso = new Map<string, Promise<Carta>>();

export function obtenerCarta(slug: string): Promise<Carta> {
  if (import.meta.env.DEV) return pedirCarta(slug);
  if (!enCurso.has(slug)) enCurso.set(slug, pedirCarta(slug));
  return enCurso.get(slug)!;
}

async function pedirCarta(slug: string): Promise<Carta> {
  const url = `${urlDeApi()}/api/cartas/${encodeURIComponent(slug)}.json`;
  let problema: string;
  try {
    const respuesta = await fetch(url, { headers: { Accept: 'application/json' } });
    if (respuesta.ok) {
      const carta = (await respuesta.json()) as Carta;
      if (Array.isArray(carta?.categorias)) return carta;
      problema = 'la respuesta no tiene el formato esperado (falta "categorias")';
    } else if (respuesta.status === 404) {
      problema = '404: la carta no está publicada en smaalacarta';
    } else if (respuesta.status === 502) {
      problema = '502: falla de smaalacarta';
    } else if (respuesta.status === 429) {
      problema = '429: smaalacarta bloquea el pedido (firewall)';
    } else {
      problema = `respuesta ${respuesta.status}`;
    }
  } catch (error) {
    problema = `no se pudo conectar (${error instanceof Error ? error.message : String(error)})`;
  }

  if (import.meta.env.DEV && ejemplos[slug]) {
    console.warn(`\n[carta] ${url} → ${problema}.\n[carta] Usando la carta DE EJEMPLO (src/contenido/carta-barricas.ejemplo.json). Solo en dev.\n`);
    return ejemplos[slug];
  }
  throw new Error(
    `\n\nNo se pudo traer la carta "${slug}" de smaalacarta.\n  ${url}\n  → ${problema}\n` +
      `El build se corta a propósito para no publicar una carta vacía o vieja: la web publicada queda como estaba.\n` +
      `Para usar otra API: CARTAS_API=https://... npm run build\n`,
  );
}

const formatoPesos = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 });

/** "$ 12.500", o "Consultar" si no tiene precio. */
export function textoPrecio(precio: number | null | undefined): string {
  return typeof precio === 'number' && Number.isFinite(precio) ? `$ ${formatoPesos.format(precio)}` : 'Consultar';
}
