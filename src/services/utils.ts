import { z } from 'zod';

export const paginationParamsSchema = z.object({
  page: z.coerce.number().catch(1),
  per_page: z.coerce.number().catch(10),
});

export const paginatedMetaSchema = z.object({
  count: z.coerce.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
});

export const toPaginatedSchema = <T extends z.ZodTypeAny>(schema: T) => {
  return paginatedMetaSchema.extend({
    results: schema.array(),
  });
};
