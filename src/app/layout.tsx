import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers, { NextAuthProvider } from './providers';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = {
  title: 'Giya',
  description: 'Mental Health App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <NextAuthProvider>
            {children}
            <Toaster />
          </NextAuthProvider>
        </Providers>
      </body>
    </html>
  );
}
