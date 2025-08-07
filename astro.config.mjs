// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import rehypeMermaid from 'rehype-mermaid';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://kirilligum.com',
  integrations: [mdx(), sitemap()],
  markdown: {
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid'],
    },
    rehypePlugins: [
      [
        rehypeMermaid,
        {
          strategy: 'img-svg',
          mermaidConfig: {
            theme: 'forest',
          },
        },
      ],
    ],
  },
});
