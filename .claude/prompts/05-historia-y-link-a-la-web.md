Estado: hecho (2026-11-27, commit 5a82fda)

# 05 · "Nuestra historia" y link a la web principal desde /cartas

## Objetivo
Desde `/cartas` (la página del QR) se puede ir a:
1. **Nuestra historia**: la página `/nuestra-historia`, con un texto corto por ahora (ya existe, se edita desde el panel).
2. **La web principal** (`/`): un segundo botón, debajo del de historia, que lleva a la raíz.
   Mientras la raíz siga "en construcción", ese botón muestra el aviso del panel y desde `/` tiene que haber
   un botón de vuelta a `/cartas` ("Ver las cartas"), así nadie queda en un callejón sin salida.

## Skills y agentes
- Skills: `frontend-design` (botón nuevo, mismo estilo que "Nuestra historia"), `seo-local` (enlaces internos)
- Agentes: `contenido` (textos y `.pages.yml`), `maquetador` (botones), `verificador` (al final)

## Archivos
- `src/contenido/cartas.json` y `.pages.yml` (sección "Textos de /cartas"):
  sumar `webTitulo` ("Conocé Familia El Abasto"), `webBajada` ("La web completa, muy pronto") y `webLink` ("/").
  Cambiar `historiaBajada` a "Quiénes somos y cómo empezó" (la página todavía no tiene fotos ni mapa).
- `src/pages/cartas.astro`: botón nuevo debajo de "Nuestra historia", oculto si `webLink` queda vacío.
- `src/componentes/EnConstruccion.astro`: botón "Ver las cartas" que lleva a `/cartas`
  (texto editable en `src/contenido/en-construccion.json` + `.pages.yml`).
- `src/contenido/paginas/nuestra-historia.md`: revisar que el texto corto se lea bien; **no inventar historia**,
  si hace falta más texto pedírselo a Herni.

## Pasos
1. `git switch dev && git switch -c historia-y-web dev`
2. Hacer los cambios de arriba.
3. `npm run dev` y probar el recorrido: `/cartas` → Nuestra historia → volver; `/cartas` → web principal → "Ver las cartas".
4. Agente verificador.

## Terminado cuando
- [x] Desde `/cartas` se llega a `/nuestra-historia` y a `/`, y desde `/` se vuelve a `/cartas`.
- [x] Todos los textos nuevos se editan desde Pages CMS.
- [x] Verificador: ✅
- [x] Rama mergeada a `dev` y borrada. **Sin push.**

## No tocar
- La ruta `/cartas` y sus redirecciones.
