import { z } from 'zod';
import { toPayloadDate } from './utils';

export const timeStringToDateSchema = z.preprocess(
  (v) =>
    z.coerce.date().safeParse(`${toPayloadDate(new Date())}T${v}`).success
      ? `${toPayloadDate(new Date())}T${v}`
      : undefined,
  z.coerce.date(),
);
