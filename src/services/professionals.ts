import { z } from 'zod';
import { userSchema } from './users';
import { restAPI } from './api';
import { toPaginatedSchema } from './utils';

export const USER_PROFESSION_VALUES = {
  Counselor: 'counselor',
  Psychologist: 'psychologist',
} as const;
export const professionSchema = z.nativeEnum(USER_PROFESSION_VALUES);

export const professionalSchema = userSchema
  .omit({ carer_id: true, favorite_items: true })
  .extend({
    professional: z.object({
      id: z.coerce.number(),
      profession: professionSchema,
    }),
  });
export type Professional = z.infer<typeof professionalSchema>;
export const getProfessional = async (params: { id: number }) => {
  const response = await restAPI.url(`/users/${params.id}`).get();
  return professionalSchema.parse(response);
};

export const getProfessionals = async (params?: Partial<{}>) => {
  const response = await restAPI
    .url('/users')
    .query({ user_type: 'professional' })
    .get();
  return toPaginatedSchema(professionalSchema).parse(response);
};
