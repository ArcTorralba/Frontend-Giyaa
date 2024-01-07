import { useQuery } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';
import { z } from 'zod';
import { restAPI } from './api';
import { getUserSession } from './auth';

export const userSchema = z.object({
  id: z.coerce.number(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  is_staff: z.boolean(),
  profile_photo: z
    .string()
    .nullish()
    .transform((x) => x ?? undefined),
  professional_id: z.coerce.number().nullish(),
  carer_id: z.coerce.number().nullish(),
  description: z
    .string()
    .nullish()
    .transform((x) => x ?? undefined),
  favorite_items: z.object({ id: z.coerce.number() }).array().catch([]),
});

export const getSingleUser = async (id: number) => {
  const response = (await restAPI.get(`/users/${id}`)) as unknown as
    | Partial<Record<string, any>>
    | undefined;

  return userSchema.parse({
    ...response,
    professional_id: response?.professional?.id,
    carer_id: response?.carer?.id,
    description: response?.professional?.description,
    favorite_items: response?.carer?.favorite_items ?? [],
  });
};
export const getUser = async () => {
  let session = null;
  if (typeof window === 'undefined') {
    session = await getUserSession();
  } else {
    session = await getSession();
  }
  if (session === null) {
    throw new Error('Not logged in');
  }
  return getSingleUser(session.user.id);
};

export const useCurrentUser = () => useQuery(['current-user'], () => getUser());
