# Prompts numerados

Los arma Claude Desktop al planificar; los ejecuta Claude en VS Code, uno por vez y en orden.

Plantilla de cada archivo (`NN-tema-corto.md`):

```markdown
Estado: pendiente

# NN · Título

## Objetivo
Qué tiene que quedar funcionando, en una o dos oraciones.

## Skills y agentes
- Skill/plugin: ... (instalado)
- Agente: maquetador | contenido | verificador

## Archivos
- ...

## Pasos
1. git switch main && git pull && git switch -c <rama>
2. ...

## Terminado cuando
- [ ] ...
- [ ] Agente verificador: ✅

## No tocar
- La ruta /cartas y sus redirecciones.
```
