// Colecciones que el admin crea desde Pages CMS (ver .pages.yml):
// - paginas: cada archivo .md es una página nueva del sitio, en /<nombre-del-archivo>
// - blog: cada archivo .md es una nota, en /blog/<nombre-del-archivo>
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const textoOpcional = z.string().nullish().transform((v) => v ?? '');

const paginas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/contenido/paginas' }),
  schema: z.object({
    titulo: z.string().min(1),
    descripcion: z.string().min(1),
    imagen: textoOpcional,
    imagenAlt: textoOpcional,
    enMenu: z.boolean().default(false),
    orden: z.coerce.number().default(0),
    borrador: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/contenido/blog' }),
  schema: z.object({
    titulo: z.string().min(1),
    descripcion: z.string().min(1),
    fecha: z.coerce.date(),
    imagen: textoOpcional,
    imagenAlt: textoOpcional,
    borrador: z.boolean().default(false),
  }),
});

export const collections = { paginas, blog };
