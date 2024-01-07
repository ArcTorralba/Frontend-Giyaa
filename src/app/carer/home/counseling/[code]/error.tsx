'use client'; // Error components must be Client Components

import { Button } from '@/components/ui/button';
import { z } from 'zod';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { error: errorMessage } = z
    .object({ error: z.coerce.string() })
    .catch({ error: 'Something went wrong' })
    .parse(JSON.parse(error.message));

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold leading-none tracking-tight">
        {errorMessage}
      </h2>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
