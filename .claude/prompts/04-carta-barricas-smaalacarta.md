Estado: pendiente (falta definir con Herni)

# 04 · Carta de Las Barricas desde smaalacarta / menú web

## Objetivo
Que el botón "Ver carta" de Las Barricas lleve a su carta, que se va a cargar en smaalacarta (menú web).

## Antes de empezar, definir con Herni
- ¿La carta va a vivir en un link externo de smaalacarta (como El Abasto y Luisa) o se trae al sitio
  con `obtenerCarta()` (`src/lib/carta.ts`)?
- Si es link externo: solo hay que cargar `menu` de Las Barricas en `sitio.json` (agente `contenido`).
- Si se trae al sitio: definir la ruta (`/barricas` ya está reservada) y de dónde salen los datos.

## Skills y agentes
- Skills: `frontend-design` (si hay página nueva), `seo-local` (`hasMenu`, datos de la carta)
- Agentes: `contenido`, `maquetador`, `verificador`
