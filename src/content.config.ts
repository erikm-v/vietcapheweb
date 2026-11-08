import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const categories = [
  "Robusta education",
  "Roaster playbook",
  "Product ideas",
  "Market & sourcing",
  "Demand & trends",
  "Origin & sustainability",
  "Case study",
] as const;

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(80),
      /** Shorter title for the <title> tag when `title` runs past 60 characters. */
      seoTitle: z.string().max(60).optional(),
      description: z.string().min(80).max(160),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: z.enum(categories),
      tags: z.array(z.string()).default([]),
      /** Optional photo. Without one, the post gets generated cover art. */
      cover: image().optional(),
      coverAlt: z.string().optional(),
      coverTheme: z.enum(["orange", "ink", "yellow", "cream"]).default("orange"),
      takeaways: z.array(z.string()).min(3).max(6),
      faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
      sources: z
        .array(z.object({ title: z.string(), publisher: z.string(), url: z.url() }))
        .default([]),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
