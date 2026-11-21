# Web de Familia El Abasto

Web de Familia El Abasto: El Abasto, Luisa del Abasto y Las Barricas del Abasto (San Martín de los Andes).
Sitio estático hecho con [Astro](https://astro.build), publicado en Cloudflare Pages
y editable por el cliente con [Pages CMS](https://pagescms.org).

**Estado actual:** `/` y `/menus` (la del QR) muestran solo un hero "en construcción":
logo, "Familia El Abasto" y un aviso editable. Los datos de los locales ya están cargados
para las pantallas definitivas.

> **Fotos y logos provisorios:** los de `public/fotos/` se recortaron del PDF del diseño
> (`El Abasto web nueva.pdf`). Reemplazarlos por los originales de la carpeta `fotos/`
> del cliente desde el panel (mismo nombre o cambiando la foto de cada local).

El admin ya puede crear páginas nuevas y notas de blog desde el panel.

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
| Páginas que crea el admin (cada archivo es `/<nombre>`) | `src/contenido/paginas/*.md` |
| Notas del blog (cada archivo es `/blog/<nombre>`) | `src/contenido/blog/*.md` |
| Esquema de páginas y blog | `src/content.config.ts` |
| Sitemap, robots, `llms.txt`, `llms-full.txt` | `src/pages/*.ts` |
| Panel de edición | `.pages.yml` |

**Datos pendientes:** se escriben entre corchetes, por ejemplo `[Dirección de Luisa del Abasto]`.
La web no muestra los datos que empiezan con `[`, así nunca aparece un corchete publicado.

**Carta:** un plato sin precio se muestra como "Consultar".

## Páginas y blog (autoadministrable)

Desde el panel, el admin puede:

- **Crear una página nueva** (sección "Páginas"): queda en `https://[dominio]/<nombre-de-la-página>`.
  Con "Mostrar en el menú de arriba" aparece en el menú de navegación.
- **Escribir una nota** (sección "Blog"): queda en `https://[dominio]/blog/<nombre-de-la-nota>`.
- Marcar **Borrador** para guardar sin publicar.

Hay direcciones reservadas que una página no puede usar (`menus`, `blog`, `barricas`, `qr`, etc.).
Si alguien lo intenta, el build falla con un mensaje claro y la web publicada sigue como estaba.

## Google y modelos de IA

- `/sitemap.xml` y `robots.txt` (con el link al sitemap) se arman solos con cada página y nota.
- `/llms.txt` y `/llms-full.txt` resumen el sitio y su texto completo para modelos de IA ([llmstxt.org](https://llmstxt.org)).
- Cada página lleva datos estructurados schema.org: los tres restaurantes con dirección, teléfono,
  menú y redes en el inicio y en `/menus`, y `BlogPosting` en cada nota.
- **Importante:** hasta que se cargue el dominio en "Datos del grupo" el sitemap queda vacío
  y no hay URLs canónicas. Después de publicarlo, dar de alta el sitio en
  [Google Search Console](https://search.google.com/search-console) y enviar `https://[dominio]/sitemap.xml`.

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
