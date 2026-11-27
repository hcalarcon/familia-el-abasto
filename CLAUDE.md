# CLAUDE.md — Web Familia El Abasto

Sitio estático en Astro para El Abasto, Luisa del Abasto y Las Barricas del Abasto.
El README explica la estructura; acá van las reglas de trabajo.

## Reglas que no se rompen

- **`/cartas` es intocable.** El QR impreso apunta a `https://elabastorestaurant.com.ar/cartas`.
  No se renombra, no se borra, no se mueve. `/menus`, `/menu`, `/qr`, `/carta` siguen redirigiendo ahí.
- Los componentes nunca leen los JSON directo: todo pasa por `src/lib/contenido.ts` (y `src/lib/carta.ts`).
- Todo dato editable por el cliente va en `src/contenido/` **y** se declara en `.pages.yml`,
  así se puede editar desde Pages CMS.
- Datos pendientes entre corchetes (`[Dirección ...]`): la web no los muestra. Nunca publicar un `[`.
- Textos en español rioplatense, nombres de archivos y código en español como el resto del repo.

## Flujo de git (lo maneja Claude)

1. Antes de empezar: `git switch main && git pull` (el cliente edita desde Pages CMS y eso commitea en `main`).
2. Cada tarea en su rama: `git switch -c <tema-corto>`.
3. Commits chicos con mensaje en español, en imperativo ("Agregar...", "Corregir...").
4. Antes de mergear: correr el agente `verificador` (build + check + rutas del QR).
5. Merge a `main` y `git push origin main` **solo con el OK explícito de Herni**:
   cada push a `main` publica el sitio en producción.
6. Después del merge, borrar la rama local.

No usar SSH: el remoto es HTTPS (`https://github.com/familiaelabasto/familia-el-abasto.git`).

## Agentes (`.claude/agents/`)

- `maquetador`: páginas, componentes y estilos en Astro.
- `contenido`: textos, datos de locales, carta, páginas y blog (JSON / Markdown + `.pages.yml`).
- `verificador`: revisa antes de mergear. No edita archivos.

## Comandos

```bash
npm run dev       # http://localhost:4321 (queda en segundo plano; parar con: npx astro dev stop)
npm run build
npm run check
npm run preview
```
