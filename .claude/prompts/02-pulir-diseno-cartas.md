Estado: pendiente

# 02 · Pulir el diseño de /cartas

## Objetivo
Que `/cartas` quede prolija en celular y escritorio antes de publicar, respetando el diseño aprobado
(`El Abasto web nueva.pdf`) con los cambios ya pedidos: redes arriba, chip de ubicación,
Reservar por teléfono en Las Barricas y Zapan propio por local.

## Skills y agentes
- Skill: `frontend-design`
- Agente: `maquetador` (cambios), `verificador` (al final)

## Archivos
- `src/pages/cartas.astro`
- `src/layouts/Base.astro` (solo si hace falta para fuentes o variables)

## Pasos
1. `git switch main && git pull && git switch -c pulir-cartas`
2. Revisar en 375 px, 768 px y 1280 px:
   - Fuentes Alfa Slab One, Work Sans y Caveat cargando (si no, evaluar servirlas locales en `public/fuentes/` para no depender de Google Fonts).
   - En escritorio, que las tres tarjetas queden alineadas (botones a la misma altura).
   - Estados `:hover` y `:focus-visible` en chips, botones y redes.
   - Contraste AA de todos los textos (el chip vino sobre crema, el texto suave sobre papel).
3. Revisar que la imagen de la primera tarjeta cargue con prioridad y el resto en `lazy`.
4. Medir con Lighthouse (Chrome DevTools, modo móvil) sobre `npm run build && npm run preview`: Performance, Accessibility, Best Practices y SEO ≥ 95.

## Terminado cuando
- [ ] Capturas en 375 / 1280 px adjuntas en el mensaje del commit o en el chat.
- [ ] Lighthouse ≥ 95 en las cuatro categorías.
- [ ] Verificador: ✅

## No tocar
- La ruta `/cartas`, las redirecciones y los textos del cliente (salen de `src/contenido/`).
