import { z } from 'zod';

export interface Tag {
  fields: {
    name: string;
    slug: string;
  };
}

export const tagSchema = z.object({
  fields: z.object({
    name: z.string(),
    slug: z.string(),
  }),
});
