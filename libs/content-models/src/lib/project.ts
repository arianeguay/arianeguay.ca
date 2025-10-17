import { z } from 'zod';
import { seoSchema } from './seo';

export interface Project {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    title: string;
    slug: string;
    role: string;
    stack: string[];
    heroImage: {
      fields: {
        title: string;
        file: {
          url: string;
        };
      };
    };
    gallery: Array<{
      fields: {
        title: string;
        file: {
          url: string;
        };
      };
    }>;
    body: string;
    client: string;
    year: string;
    seo: {
      fields: {
        title: string;
        description: string;
        keywords: string[];
      };
    };
  };
}

export const projectSchema = z.object({
  sys: z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  fields: z.object({
    title: z.string(),
    slug: z.string(),
    role: z.string(),
    stack: z.array(z.string()),
    heroImage: z.object({
      fields: z.object({
        title: z.string(),
        file: z.object({
          url: z.string(),
        }),
      }),
    }),
    gallery: z.array(
      z.object({
        fields: z.object({
          title: z.string(),
          file: z.object({
            url: z.string(),
          }),
        }),
      })
    ),
    body: z.string(),
    client: z.string(),
    year: z.string(),
    seo: seoSchema,
  }),
});
