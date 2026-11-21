# Web del Grupo El Abasto

Web de El Abasto, Luisa del Abasto y Las Barricas del Abasto (San Martín de los Andes).
Sitio estático hecho con [Astro](https://astro.build), publicado en Cloudflare Pages
y editable por el cliente con [Pages CMS](https://pagescms.org).

**Estado actual:** páginas provisorias "en construcción" en `/` y en `/menus` (la del QR),
con la historia, los tres locales, sus menús, teléfonos y redes.

## La ruta `/menus` no se cambia nunca

El QR impreso en los folletos apunta a `https://[dominio]/menus`. Esa dirección
tiene que funcionar siempre: no se renombra, no se borra y no se mueve.
Mientras la web está en construcción, `/menus` muestra los menús de los tres locales
(`src/pages/menus.astro`). `/menu`, `/menú`, `/qr` y `/carta` redirigen a `/menus` (ver `public/_redirects`).

## Levantarlo en local

Hace falta Node 22.23.4 o más nuevo.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # genera dist/
npm run preview   # sirve dist/ para probar el build
```

`npm run dev` no aplica `_redirects` (eso lo hace Cloudflare): para probar las
redirecciones hay que usar la vista previa de Cloudflare Pages.

## Dónde está cada cosa

| Qué | Dónde |
| --- | --- |
| Textos, locales, teléfonos, links y redes | `src/contenido/sitio.json` |
| Textos de la página en construcción | `src/contenido/en-construccion.json` |
| Carta de Las Barricas | `src/contenido/carta-barricas.json` |
| Lectura del contenido (los componentes nunca leen los JSON directo) | `src/lib/contenido.ts` |
| Carta: `obtenerCarta()` hoy lee el JSON; mañana, el panel de Zapan | `src/lib/carta.ts` |
| Fotos que sube el cliente | `public/fotos/` |
| Redirecciones y cabeceras de Cloudflare | `public/_redirects`, `public/_headers` |
| Panel de edición | `.pages.yml` |

**Datos pendientes:** se escriben entre corchetes, por ejemplo `[Dirección de Luisa del Abasto]`.
La web no muestra los datos que empiezan con `[`, así nunca aparece un corchete publicado.

**Carta:** un plato sin precio se muestra como "Consultar".

## Publicar en Cloudflare Pages

1. Subir este repositorio a GitHub, en la cuenta del cliente.
2. En Cloudflare: **Workers & Pages** → **Create** → pestaña **Pages** → **Connect to Git**.
3. Autorizar GitHub y elegir este repositorio.
4. Configuración del build:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Variable de entorno: `NODE_VERSION` = `22` (también está en `.node-version`).
5. **Save and Deploy**. Queda publicado en `https://<proyecto>.pages.dev`.
   Desde ahí, cada commit en `main` se publica solo.

### Conectar el dominio

El dominio está registrado en nic.ar y sus DNS ya están en Cloudflare.

1. En el proyecto de Pages: **Custom domains** → **Set up a custom domain**.
2. Escribir `[dominio]` y confirmar. Como el DNS está en la misma cuenta de
   Cloudflare, el registro se crea solo.
3. Repetir con `www.[dominio]`.
4. Esperar que el certificado figure como **Active** (suele tardar unos minutos).
5. Probar `https://[dominio]/menus` desde el celular, escaneando un folleto.

## Editar el contenido (Pages CMS)

1. Entrar en https://app.pagescms.org con la cuenta de GitHub que tiene acceso al repositorio.
2. Elegir el repositorio y la rama `main`.
3. Editar "Datos del grupo y los locales", "Página en construcción" o "Carta de Las Barricas" y guardar.
4. Cada guardado es un commit; Cloudflare Pages publica el cambio en uno o dos minutos.
