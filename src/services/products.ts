import * as z from 'zod';
import { userSchema } from './users';
import { toPaginatedSchema } from './utils';
import { restAPI } from './api';
import { removeEmptyProperties } from '@/lib/utils';

export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.coerce.number(),
  location: z.string(),
  category: z.string(),
  description: z.string(),
  image: z.string().nullable(),
  contact_number: z.string(),
  facebook_url: z.string(),
  created_by: z.object({
    id: z.number(),
    user: z.object({
      id: z.coerce.number(),
    }),
  }),
  flagged: z.boolean(),
});
export type Product = z.infer<typeof productSchema>;

const marketplaceItemParams = z.object({
  carer_id: z.coerce.number(),
  category: z.coerce.string(),
});
export const getProducts = async (
  params?: Partial<z.infer<typeof marketplaceItemParams>>,
) => {
  const response = await restAPI
    .url('/marketplace')
    .query(removeEmptyProperties(params ?? {}))
    .get();
  return toPaginatedSchema(productSchema).parse(response);
};

export const getUserProducts = async (carer_id: number) => {
  const response = await restAPI
    .options({ next: { revalidate: 0 } })
    .url('/marketplace')
    .query({ carer_id: carer_id })
    .get();
  return toPaginatedSchema(productSchema).parse(response);
};

export const getProduct = async (id: number) => {
  const response = await restAPI.url(`/marketplace/${id}`).get();
  return productSchema.parse(response);
};

export const getFavoriteProducts = async (userId: number) => {
  const response: any = await restAPI.url(`/users/${userId}`).get();
  return productSchema.array().parse(response?.carer?.favorite_items);
};

const productFilterSchema = z
  .object({
    name: z.string(),
    value: z.string(),
  })
  .array();

export const getMarketplaceFilters = async (category?: string) => {
  const response = await restAPI.url('/marketplace/categories').get();

  return productFilterSchema.parse(response);
};
