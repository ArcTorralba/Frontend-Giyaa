'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  BoxIcon,
  DollarSign,
  HeartIcon,
  HomeIcon,
  ImageIcon,
  MenuIcon,
  PlusIcon,
  Settings,
  ShirtIcon,
  ShoppingBag,
  ShoppingCartIcon,
  UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const marketplaceNavigation = [
  {
    name: 'Market',
    href: '/carer/marketplace/featured',
    icon: ShoppingCartIcon,
  },
  // TODO: Replace with icon  from mockup
  {
    name: 'My Products',
    href: '/carer/marketplace/my-products',
    icon: ShoppingBag,
  },
  { name: 'Favorites', href: '/carer/marketplace/favorites', icon: HeartIcon },
];

const categoryFilters = [
  {
    name: 'Artwork',
    href: '/carer/marketplace',
    param: 'artwork',
    icon: ImageIcon,
  },
  // TODO: Replace with icon  from mockup
  {
    name: 'Clothes',
    href: '/carer/marketplace',
    param: 'clothes',
    icon: ShirtIcon,
  },
  {
    name: 'Others',
    href: '/carer/marketplace',
    param: 'others',
    icon: BoxIcon,
  },
];

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="space-y-4">
      {/* <nav className="flex items-center">
        {categoryFilters.map((item) => {
          const matches = searchParams.get('category') === item.param;
          return (
            <Link
              key={item.name}
              href={{
                pathname,
                query: {
                  category: item.param,
                },
              }}
              className={cn(
                'group inline-flex items-center py-1.5 px-3 text-sm font-medium rounded-md',
                {
                  'bg-primary rounded-full text-white': matches,
                  'text-black hover:text-white hover:bg-primary rounded-full hover:bg-opacity-75':
                    !matches,
                },
              )}
            >
              <item.icon
                className={cn('mr-3 flex-shrink-0 h-4 w-4', {
                  ' text-black group-hover:text-white': !matches,
                  ' text-white': matches,
                })}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
        {searchParams.toString().length !== 0 && (
          <Button asChild variant="link">
            <Link href={pathname}>Clear Filter</Link>
          </Button>
        )}
      </nav> */}
      {/* <div className="flex-1 flex flex-col min-h-0 bg-white border-r">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="px-6 divide-y divide-gray-300">
              <div className="pb-4">
                <h1 className="text-xl text-black font-semibold ">
                  Marketplace
                </h1>
                <nav className="mt-5 flex-1 space-y-1">
                  {marketplaceNavigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'group flex items-center px-5 py-3 text-sm font-medium rounded-md',
                        {
                          'bg-primary rounded-full text-white':
                            pathname === item.href,
                          'text-black hover:text-white hover:bg-primary rounded-full hover:bg-opacity-75':
                            pathname !== item.href,
                        },
                      )}
                    >
                      <item.icon
                        className={cn('mr-3 flex-shrink-0 h-6 w-6', {
                          ' text-black group-hover:text-white':
                            pathname !== item.href,
                          ' text-white': pathname === item.href,
                        })}
                        aria-hidden="true"
                      />
                      {item.name}
                      {}
                    </a>
                  ))}
                </nav>
              </div>

              <Button className="w-full mt-4">
                <span>
                  <PlusIcon />
                </span>
                <span>Create Product</span>
              </Button>
            </div>
          </div>
        </div> */}
      <section className="max-w-7xl">{children}</section>
    </div>
  );
}
