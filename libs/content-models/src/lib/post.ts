import { z } from 'zod';
import { authorSchema } from './author';
import { tagSchema } from './tag';
import { seoSchema } from './seo';

export interface Post {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    cover: {
      fields: {
        title: string;
        file: {
          url: string;
          details: {
            size: number;
          };
          fileName: string;
          contentType: string;
        };
      };
    };
    tags: Array<{ fields: { name: string; slug: string } }>;
    author: {
      fields: {
        name: string;
        picture: {
          fields: {
            title: string;
            file: {
              url: string;
            };
          };
        };
      };
    };
    seo: {
      fields: {
        title: string;
        description: string;
        keywords: string[];
      };
    };
  };
}

export const postSchema = z.object({
  sys: z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  fields: z.object({
    title: z.string(),
    slug: z.string(),
    excerpt: z.string(),
    body: z.string(),
    cover: z.object({
      fields: z.object({
        title: z.string(),
        file: z.object({
          url: z.string(),
          details: z.object({
            size: z.number(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    }),
    tags: z.array(tagSchema),
    author: authorSchema,
    seo: seoSchema,
  }),
});
