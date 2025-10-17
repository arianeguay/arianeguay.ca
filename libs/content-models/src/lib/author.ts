import { z } from 'zod';

export interface Author {
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
}

export const authorSchema = z.object({
  fields: z.object({
    name: z.string(),
    picture: z.object({
      fields: z.object({
        title: z.string(),
        file: z.object({
          url: z.string(),
        }),
      }),
    }),
  }),
});
