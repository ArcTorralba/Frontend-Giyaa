'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { z } from 'zod';

export default function CategoryFilters({
  filters,
  onChange: onChangeHandler,
}: {
  filters: Array<{ name: string; value: string }>;
  onChange?: (formData: FormData) => PromiseLike<void>;
}) {
  const searchParams = z
    .object({ category: z.coerce.string().catch('') })
    .parse(Object.fromEntries(useSearchParams().entries()));

  return (
    <form
      onChange={(e) => {
        if (onChangeHandler) {
          onChangeHandler(new FormData(e.currentTarget));
        }
      }}
      className="pt-6"
    >
      <fieldset className="space-y-3">
        <legend className="block text-sm font-medium text-gray-900">
          Category
        </legend>
        <div className="space-y-2">
          {filters.map((option, optionIdx) => (
            <div key={option.value} className="flex items-center">
              <Checkbox
                name={'category'}
                value={option.value}
                id={option.name}
                defaultChecked={option.value === searchParams.category}
              />
              <label
                htmlFor={`${option.name}`}
                className="ml-3 select-none text-sm text-gray-600"
              >
                {option.name}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </form>
  );
}
