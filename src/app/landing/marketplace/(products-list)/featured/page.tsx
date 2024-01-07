import ProductCard from '@/components/ProductCard';
import { Checkbox } from '@/components/ui/checkbox';
import { getMarketplaceFilters, getProducts } from '@/services/products';
import { redirect } from 'next/navigation';
import React from 'react';
import { z } from 'zod';
import CategoryFilters from './CategoryFilters';

const searchParamsSchema = z.object({
  category: z.string().optional(),
});

export default async function FeaturedProducts(props: {
  searchParams: unknown;
}) {
  const searchParams = searchParamsSchema.parse(props.searchParams);
  const { results: products } = await getProducts({ ...searchParams });
  const filters = await getMarketplaceFilters();
  const handleCategoryChange = async (formData: FormData) => {
    'use server';
    const categories = await getMarketplaceFilters();
    const category = z.coerce
      .string()
      .refine((v) => categories.some((filter) => filter.value === v))
      .catch('')
      .parse(formData.get('category'));
    // .parse(filter);

    // revalidate cache
    redirect(
      `/landing/marketplace/featured${category ? `?category=${category}` : ''}`,
    );
  };

  return (
    <div>
      <div className="pb-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary">
          Marketplace Products
        </h1>
        <p className="mt-2 text-base text-gray-500">
          Checkout out and support other people.
        </p>
      </div>
      <section className="pt-10 pb-24 lg:grid lg:grid-cols-5 lg:gap-x-8">
        <aside>
          <h2 className="sr-only">Filters</h2>
          <div className="hidden lg:block">
            <CategoryFilters
              filters={filters}
              onChange={handleCategoryChange}
            />
          </div>
        </aside>
        <section className="mt-6 lg:mt-0 lg:col-span-4">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </section>
      </section>
    </div>
  );
}
