---
name: seo-local
description: SEO local y legibilidad para buscadores y modelos de IA en el sitio de Familia El Abasto (restaurantes en San Martín de los Andes). Usar al crear o cambiar páginas, textos, datos de locales, títulos, descripciones, datos estructurados, sitemap o llms.txt.
---

# SEO local para Familia El Abasto

Objetivo: que quien busque dónde comer en San Martín de los Andes (en Google o preguntándole a una IA)
encuentre a El Abasto, Luisa del Abasto y Las Barricas del Abasto, y que más adelante, cuando abra
la sucursal de Buenos Aires, la marca ya sea conocida.

## Antes de tocar nada

Leé `src/lib/seo.ts`, `src/layouts/Base.astro`, `src/lib/indice.ts` y `src/pages/llms*.txt.ts`:
ahí ya está resuelto casi todo. Extendé eso, no lo dupliques.

## Reglas

- **Un `<h1>` por página**, títulos en orden (h1 → h2 → h3), `<main>`, `<header>`, `<footer>`, `<nav>`, `<article>`, `<address>`.
- **`<title>`**: qué + dónde. Ej. "Cartas y reservas · El Abasto, Luisa del Abasto y Las Barricas del Abasto · San Martín de los Andes". Máx. ~65 caracteres útiles al principio.
- **Meta description**: 120–160 caracteres, con ciudad y tipo de comida. Nada de relleno.
- **Datos estructurados** (JSON-LD, `src/lib/seo.ts`): `Restaurant` por local con `name`, `address`
  (`PostalAddress` con `postalCode` Q8370, `addressLocality`, `addressRegion` Neuquén, `addressCountry` AR),
  `telephone` en formato +54, `hasMap`, `hasMenu`, `image`, `sameAs` (redes), `acceptsReservations`.
  `openingHours` solo en formato schema (`Mo-Su 12:00-24:00`), nunca texto libre.
  `servesCuisine` y `priceRange` solo si el cliente los confirmó.
- **NAP consistente**: nombre, dirección y teléfono iguales en la web, en Google Business Profile y en redes.
  Si hay que cambiarlos, cambian en `src/contenido/sitio.json` y se avisa al cliente para que los cambie en Google.
- **Datos pendientes** (`[...]`) nunca se publican ni en el HTML ni en el JSON-LD (`esPendiente()`).
- **Imágenes**: `.webp`, `alt` descriptivo con el lugar ("Salón de El Abasto en San Martín de los Andes"), `width`/`height`.
- **URLs**: cortas, en español, sin barra final. `/cartas` no se toca nunca.
- **Para IA**: `/llms.txt` y `/llms-full.txt` tienen que reflejar cada local con dirección, teléfono, horario y links.
  Si se agrega un dato nuevo a un local, sumarlo también ahí.
- **Futuro (sucursal Buenos Aires)**: cada local es un `Restaurant` con su propia ciudad; no asumir que todo es San Martín de los Andes cuando se agregue uno nuevo.

## Cómo verificar

1. `npm run build`.
2. Revisar el JSON-LD de `dist/*.html` (que sea JSON válido y no tenga corchetes).
3. Validar en https://validator.schema.org y en https://search.google.com/test/rich-results con la URL publicada.
4. Revisar `dist/sitemap.xml`, `dist/robots.txt`, `dist/llms.txt`.
