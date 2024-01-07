import { z } from 'zod';
import { professionSchema } from './professionals';
import { userSchema } from './users';
import { restAPI } from './api';
import { toPaginatedSchema } from './utils';

export const toolkitSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  professional: z.object({
    id: z.coerce.number(),
    profession: professionSchema,
    user: userSchema.omit({ is_staff: true }),
    description: z.string().nullable(),
  }),
  image_thumbnail: z.string().url().nullable(),
  videos: z
    .object({
      id: z.coerce.number(),
      name: z.coerce.string(),
      video: z.string().url(),
    })
    .array(),
});

export type Toolkit = z.infer<typeof toolkitSchema>;
export const getToolkit = async (id: number) => {
  const response = await restAPI.url(`/toolkits/${id}`).get();
  return toolkitSchema.parse(response);
};

export const getToolkits = async () => {
  const response = await restAPI.url(`/toolkits`).get();
  return toPaginatedSchema(toolkitSchema).parse(response);
};
