/**
 * Ruta pública de una página, como la sirve Cloudflare Pages:
 * "/cartas.html" -> "/cartas", "/index.html" -> "/", "/blog/" -> "/blog".
 */
export function rutaLimpia(pathname: string): string {
  const ruta = pathname.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '').replace(/\/+$/, '');
  return ruta || '/';
}
