Estado: pendiente

# 01 · Integrar las ramas en local y dejar todo verificado

## Objetivo
Tener en `main` **local** (sin push) el CLAUDE.md, los agentes, las skills y el diseño nuevo de `/cartas`,
con el verificador en ✅. Nada se publica en este prompt.

## Skills y agentes
- Agente: `verificador`

## Pasos
1. `git switch main && git pull` (el cliente puede haber guardado algo desde Pages CMS).
2. `git merge --no-ff claude/project-thread-nat5z8 -m "Sumar flujo de trabajo, agentes y skills"`
3. `git merge --no-ff disenar-cartas -m "Sumar el diseño definitivo de /cartas"`
4. Correr el agente `verificador` (comparando contra `origin/main`).
5. `npm run dev` y revisar http://localhost:4321/cartas en el celular (misma red: `npm run dev -- --host`).
6. Si todo está bien, borrar las ramas locales ya mergeadas: `git branch -d claude/project-thread-nat5z8 disenar-cartas`.

## Terminado cuando
- [ ] `main` local tiene los dos merges y `git status` está limpio.
- [ ] Verificador: ✅
- [ ] Revisado en el celular: redes arriba, chip 📍 en los tres locales, Zapan abre cada local, Reservar llama.
- [ ] **No** se hizo `git push` (lo decide Herni).

## No tocar
- `/cartas` y sus redirecciones.
