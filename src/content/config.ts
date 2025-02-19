import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        date: z.date(),
        tags: z.array(z.string()),
    }),
});

const projectsCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        date: z.date(),
        description: z.string(),
        tags: z.array(z.string()).optional(),
        liveLink: z.string().optional(),
        githubLink: z.string().optional(),
    }),
});

export const collections = {
    'blog': blogCollection,
    'projects': projectsCollection,
};
