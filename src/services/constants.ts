import { z } from 'zod';

export const USER_PROFESSION_VALUES = {
  Counselor: 'counselor',
  Psychologist: 'psychologist',
} as const;
export const professionSchema = z.nativeEnum(USER_PROFESSION_VALUES);
