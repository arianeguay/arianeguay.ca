import { z } from 'zod';

export interface SEO {
  fields: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const seoSchema = z.object({
  fields: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
  }),
});
