Estado: hecho (2026-11-28, commit c610b1a)

# 04 · Carta de Las Barricas desde smaalacarta

## Objetivo
`/barricas` muestra la carta de Las Barricas, traída de smaalacarta al compilar (no link externo).
El botón "Ver carta" de Las Barricas en `/cartas` lleva a `/barricas`.

## API (smaalacarta, ya implementada)
- `GET ${CARTAS_API}/api/cartas/<slug>.json`. `CARTAS_API` sale de una variable de entorno.
- Slug de Las Barricas: `las-barricas-del-abasto`. Hoy responde 429 (firewall de Vercel): es esperable,
  Herni lo está liberando. No intentar esquivarlo.
- 200 = carta. 404 `{"error":"no-disponible"}` = no publicada. 502 = falla de smaalacarta.
- Formato real (ejemplo de otra carta, recortado):
  ```json
  {"slug":"elabasto-restaurant","nombre":"El Abasto Restaurant","actualizado":null,"moneda":"ARS",
   "categorias":[
    {"nombre":"Empanadas","descripcion":null,"platos":[
      {"nombre":"Carne de ciervo cortada a cuchillo","descripcion":null,"precio":8000,"foto":null,"agotado":false},
      {"nombre":"Carne cortada a cuchillo","descripcion":null,"precio":7000,"foto":null,"agotado":false}]},
    {"nombre":"Para picar","descripcion":null,"platos":[
      {"nombre":"Provoleta al oreganato","descripcion":null,"precio":18000,"foto":null,"agotado":false}]}]}
  ```
- `actualizado` llega null: no mostrar fecha. `foto` puede ser null: el plato se tiene que ver bien sin imagen.
  `precio` null = "Consultar".

## Si la API falla
- En `npm run build`: el build FALLA con un mensaje claro (así la web publicada queda como estaba). No usar datos locales.
- En `npm run dev`: usar `src/contenido/carta-barricas.ejemplo.json` (formato de arriba, slug y nombre de Las Barricas,
  platos de ejemplo marcados como tales) y avisar en consola.

## Cambios
1. `src/lib/carta.ts`: `obtenerCarta(slug)` con fetch y las reglas de arriba. Interfaz `Carta` nueva según el formato.
2. `sitio.json`: campo `cartaSlug` por local (solo Las Barricas por ahora), declarado en `.pages.yml`.
   Si un local tiene `cartaSlug`, "Ver carta" va a su página interna.
   Sacar la sección "Carta de Las Barricas" de `.pages.yml` y borrar `carta-barricas.json` (la carta se edita en smaalacarta).
3. `src/pages/barricas.astro`: h1 "Carta de Las Barricas del Abasto", navegación rápida por categorías,
   precios es-AR ("$ 12.500"), agotado marcado y atenuado, botones "Reservar" (tel.) y "Volver a las cartas" (`/cartas`).
   Mobile first, mismo estilo que `/cartas`.
4. SEO: JSON-LD schema.org `Menu` (`hasMenuSection` → `MenuSection` → `hasMenuItem` → `MenuItem` con `offers`
   `price` y `priceCurrency` ARS). En el `Restaurant` de Las Barricas, `hasMenu` → `/barricas`.
   Sumar `/barricas` a sitemap, `llms.txt` y `llms-full.txt` (con los platos).

## Skills y agentes
- Skills: `frontend-design`, `seo-local`
- Agentes: `contenido`, `maquetador`, `verificador`

## Pasos
1. `git switch dev && git switch -c carta-barricas dev`
2. Hacer los cambios de arriba.
3. Verificador ✅. El build va a fallar por el 429 mientras siga el bloqueo: verificar con `npm run dev`.
4. Merge a `dev` y borrar la rama. **Sin push.**

## Terminado cuando
- [x] `/barricas` muestra la carta (de ejemplo en dev mientras la API dé 429).
- [x] `npm run build` falla con mensaje claro si la API no responde 200.
- [x] "Ver carta" de Las Barricas en `/cartas` lleva a `/barricas`.
- [x] JSON-LD `Menu` y `/barricas` en sitemap, `llms.txt` y `llms-full.txt`.
- [x] Verificador: ✅
- [x] Rama mergeada a `dev` y borrada. **Sin push.**

CARTAS_API por defecto: https://api.smaalacarta.com.ar.
