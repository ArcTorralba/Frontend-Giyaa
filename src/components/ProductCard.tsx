import { Product } from '@/services/products';
import Link from 'next/link';
import React from 'react';

export default function ProductCard({
  isUserOwned,
  product,
}: {
  product: Product;
  isUserOwned?: boolean;
}) {
  return (
    <div
      key={product.id}
      className="group relative bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden"
    >
      <div className="aspect-w-3 aspect-h-4 bg-gray-200 group-hover:opacity-75 sm:aspect-none sm:h-56">
        <img
          src={product.image ?? ''}
          alt={product.name}
          className="w-full h-full object-center object-cover sm:w-full sm:h-full"
        />
      </div>
      <div className="flex-1 p-4 space-y-4 flex flex-col">
        <div>
          <h3 className="text-base font-medium text-gray-900">
            <Link
              href={`/carer/marketplace/product/${product.id}`}
              className="hover:underline"
            >
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </Link>
          </h3>
          <p className="text-sm text-gray-500">{product.location}</p>
        </div>
        <div className="flex-1 flex flex-col justify-end">
          <p className="text-lg font-medium text-gray-900">{product.price}</p>
        </div>
      </div>
    </div>
  );
}
