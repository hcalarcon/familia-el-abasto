Estado: hecho (2026-11-28, commit be6f935)

# 06 · Mejorar la UI de escritorio de /cartas y /barricas

## Regla
En celular (hasta 767 px) no cambia nada. Todo va en media queries de 768 px o más.

## /barricas (desde 1024 px)
- Dos columnas: a la izquierda, índice de categorías fijo (sticky) que marca la sección visible; a la derecha, la carta.
  Ancho total de unos 1100 px.
- Arriba, la barra de chips solo en celular y tablet.
- Precios alineados en columna, con línea de puntos guía entre nombre y precio (opcional; usarla solo si queda prolijo).

## /cartas (desde 1024 px)
- Fotos de las tarjetas más altas (proporción 3:2) usando `object-fit`. Las fotos actuales son 1042x386:
  si se pixelan, dejar 16:9 y avisar a Herni.
- Logos: sacar el logo de Las Barricas del encabezado y ponerlo chico sobre la foto, abajo a la izquierda,
  para que los tres títulos queden alineados. Si un local no tiene logo, no se muestra nada.
- "Nuestra historia" y "Conocé Familia El Abasto": dos tarjetas lado a lado, más livianas
  (borde y fondo tarjeta, no barra negra).
- La línea de El Abasto repite la dirección del chip. No cambiar los datos: avisar a Herni, que lo corrige desde el panel.

## Skills y agentes
- Skill: `frontend-design`
- Agentes: `maquetador`, `verificador`

## Pasos
1. `git switch dev && git switch -c ui-escritorio dev`
2. Hacer los cambios de arriba.
3. Capturas en 1280 y 1440 px, y una en 375 px para confirmar que el celular no cambió.
4. Verificador. Merge a `dev`, borrar la rama. **Sin push.**

## Terminado cuando
- [x] /barricas en dos columnas desde 1024 px, con índice sticky que marca la sección visible.
- [x] /cartas con fotos 3:2 (o 16:9 avisado), logo sobre la foto y títulos alineados, historia y web como tarjetas.
- [x] Capturas en 1280 y 1440 px, y 375 px igual que antes.
- [x] Verificador: ✅
- [x] Rama mergeada a `dev` y borrada. **Sin push.**
