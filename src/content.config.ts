import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* The `projects` collection. Each project is one markdown file in
   src/content/projects/. The slug (its URL) comes automatically from the
   filename — e.g. walnut-dining-table.md becomes /portfolio/walnut-dining-table.
   The markdown written below the `---` frontmatter block is the long-form
   description shown on the project's own page. */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      category: z.enum([
        'kitchens',
        'bathrooms',
        'wardrobes',
        'built-ins',
        'furniture',
        'restoration',
      ]),
      materials: z.array(z.string()),
      description: z.string(),
      coverImage: image(),
      gallery: z.array(image()).default([]),
      featured: z.boolean().default(false),
      testimonial: z
        .object({
          quote: z.string(),
          attribution: z.string(),
        })
        .optional(),
    }),
});

export const collections = { projects };
