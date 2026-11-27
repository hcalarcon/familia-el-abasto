Estado: pendiente

# 03 · SEO local y datos para IA (base)

## Objetivo
Que Google y los modelos de IA entiendan bien los tres locales: dirección, teléfono, horario, menú, mapa y redes,
listo para sumar en el futuro la sucursal de Buenos Aires sin rehacer nada.

> Coordinar con el hilo "Mejorar SEO local y rendimiento de la web": este prompt es la base técnica en el repo.

## Skills y agentes
- Skill: `seo-local`
- Agentes: `contenido` (datos), `verificador` (al final)

## Archivos
- `src/lib/seo.ts`, `src/lib/contenido.ts`, `src/contenido/sitio.json`, `.pages.yml`
- `src/pages/llms.txt.ts`, `src/pages/llms-full.txt.ts`, `src/lib/indice.ts`

## Pasos
1. `git switch dev && git switch -c seo-local-base dev`
2. Pasar `ciudad`, `provincia` y `codigoPostal` a cada local (hoy están fijos en `seo.ts`) y declararlos en `.pages.yml`.
3. Agregar un campo de horario en formato schema (`horarioSchema`, ej. `Mo-Su 12:00-24:00`) y usarlo en `openingHours`.
4. Cargar `descripcion` de El Abasto y Las Barricas (pedirle el texto a Herni; no inventar).
5. Confirmar con Herni si los tres toman reservas por teléfono antes de dejar `acceptsReservations`.
6. Sumar a `llms.txt` / `llms-full.txt` la dirección, teléfono, horario, Zapan y mapa de cada local.
7. Pedirle a Herni los links exactos de Google Maps (o Google Business Profile) de cada local y cargarlos en `mapa`.

## Terminado cuando
- [ ] JSON-LD de `/` y `/cartas` sin errores en https://validator.schema.org
- [ ] `llms.txt` lista los tres locales completos.
- [ ] Verificador: ✅
