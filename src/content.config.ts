import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    series: z.string(),
    seriesOrder: z.number().default(1),
    pubDate: z.coerce.date(),
    lastReviewed: z.coerce.date().optional(),
    author: z.string().default('Chirag Singhal'),
    category: z.string(),
    readingTimeMinutes: z.number().default(6),
    sources: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    math: z.boolean().default(false),
    mermaid: z.boolean().default(false),
  }),
});

export const collections = {
  articles,
};
