'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    signOut({ callbackUrl: '/login' });
  }, []);

  return <Skeleton />;
}
