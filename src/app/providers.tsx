'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { HydrationOverlay } from '@builder.io/react-hydration-overlay';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            cacheTime: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationOverlay>{children}</HydrationOverlay>
    </QueryClientProvider>
  );
}

export const NextAuthProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return <SessionProvider>{children}</SessionProvider>;
};
