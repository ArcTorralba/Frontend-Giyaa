'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HeartIcon } from 'lucide-react';
import React from 'react';
import { experimental_useFormStatus } from 'react-dom';

export default function FavoriteButton({
  initialValue,
}: {
  initialValue?: boolean;
}) {
  const { pending } = experimental_useFormStatus();
  const favorite = initialValue ?? false;
  return (
    <Button
      type="submit"
      size="lg"
      className="w-full flex-1"
      disabled={pending}
    >
      <span>
        <HeartIcon
          className={cn('w-4 h-4', { 'fill-red-500 stroke-red-500': favorite })}
        />
      </span>
      <span>{favorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
    </Button>
  );
}
