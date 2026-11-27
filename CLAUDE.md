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

## Cómo trabajamos: planificar en Claude Desktop, ejecutar en VS Code

1. **Claude Desktop planifica.** Cada tarea se baja a uno o más prompts numerados en
   `.claude/prompts/NN-tema-corto.md` (ej. `03-carta-barricas-smaalacarta.md`), en orden de ejecución.
2. **Claude en VS Code ejecuta** un prompt por vez, en su propia rama, siguiendo el flujo de git de abajo.
3. Cada prompt dice: objetivo, archivos a tocar, criterios de "terminado", **qué skills o agentes usar**
   (solo los que estén instalados de verdad, con `/plugin` o en `.claude/agents/`) y cómo verificarlo.
4. Al terminar un prompt, se marca como hecho en su primera línea (`Estado: hecho`, con fecha y commit).

## Ramas y flujo de git (lo maneja Claude)

| Rama | Para qué | Se publica |
| --- | --- | --- |
| `main` | Producción. Solo recibe merges desde `dev`. El cliente también guarda acá desde Pages CMS. | Sí, cada push a `main` publica el sitio. |
| `dev` | Donde se trabaja: en local (`npm run dev`) y en la vista previa. | No (vista previa cuando esté Cloudflare Pages). |

1. Al empezar: `git switch dev` (y `git pull` cuando `dev` ya esté en GitHub) y traer lo que el cliente haya guardado en producción:
   `git fetch origin && git merge origin/main`.
2. Cambios chicos: commit directo en `dev`. Cambios grandes (un prompt entero): rama desde `dev`
   (`git switch -c <tema> dev`) y merge de vuelta a `dev` cuando el verificador da ✅.
3. Commits chicos con mensaje en español, en imperativo ("Agregar...", "Corregir...").
4. Probar en local: `npm run dev` y, antes de publicar, `npm run build && npm run preview`.
5. Pasar a producción **solo con el OK explícito de Herni**:
   `git switch main && git pull && git merge --no-ff dev && git push origin main`, y después `git switch dev`.
6. `git push origin dev` también se hace solo cuando Herni lo pide.

No usar SSH: el remoto es HTTPS (`https://github.com/familiaelabasto/familia-el-abasto.git`).

## Agentes (`.claude/agents/`)

- `maquetador`: páginas, componentes y estilos en Astro.
- `contenido`: textos, datos de locales, carta, páginas y blog (JSON / Markdown + `.pages.yml`).
- `verificador`: revisa antes de mergear. No edita archivos.

## Skills y plugins instalados (proyecto)

- `frontend-design` (plugin oficial): para cualquier trabajo de diseño o maquetación.
- `typescript-lsp` (plugin oficial): diagnósticos de TypeScript mientras se edita.
  Necesita `typescript-language-server` instalado global (`npm i -g typescript-language-server typescript`).
- `seo-local` (skill propia, `.claude/skills/seo-local/`): reglas de SEO local y datos para IA.

Están declarados en `.claude/settings.json`; Claude Code en VS Code los ofrece al abrir el repo.
No nombrar en los prompts skills que no estén en esta lista.

## Comandos

```bash
npm run dev       # http://localhost:4321 (queda en segundo plano; parar con: npx astro dev stop)
npm run build
npm run check
npm run preview
```
