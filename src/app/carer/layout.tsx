'use client';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Notification, { showNotification } from './notification';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  DollarSign,
  HeartIcon,
  HomeIcon,
  LogOutIcon,
  Settings,
  UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';
import { useCurrentUser } from '@/services/users';

const navigation = [
  {
    name: 'Home',
    href: '/carer/home',
    header: 'Home',
    icon: HomeIcon,
    current: true,
  },
  // TODO: Replace with icon  from mockup
  {
    name: 'Professionals',
    href: '/carer/professionals',
    header: 'Professionals',
    icon: HeartIcon,
    current: false,
  },
  {
    name: 'Toolkit',
    href: '/carer/toolkits',
    header: 'Toolkit',
    icon: UserIcon,
    current: false,
  },
  {
    name: 'Marketplace',
    href: '/carer/marketplace',
    icon: DollarSign,
    header: 'Marketplace',
    current: false,
  },
  {
    name: 'Settings',
    href: '/carer/settings',
    header: 'Settings',
    icon: Settings,
    current: false,
  },
  {
    name: 'Profile',
    href: '/carer/profile',
    header: 'Profile',
    icon: UserIcon,
    current: false,
  },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = useCurrentUser().data;
  const profile_photo = data?.profile_photo ?? '';
  const name = data ? `${data.first_name} ${data.last_name}` : '';

  const pathname = usePathname();
  const matchingPathHeader =
    [...navigation, { href: '/carer/upgrade', header: 'Upgrade Plan' }].find(
      (item) => (item.header ? new RegExp(item.href).test(pathname) : false),
    )?.header ?? '';

  return (
    <div>
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-center shrink-0 px-6">
              <img className="w-28 h-auto" src="/giya.svg" alt="Giya" />
            </div>
            <nav className="mt-5 flex-1 px-6 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-5 py-3 text-sm font-medium rounded-md',
                    {
                      'bg-primary rounded-full text-white': new RegExp(
                        item.href,
                      ).test(pathname),
                      'text-black hover:text-white hover:bg-primary rounded-full hover:bg-opacity-75':
                        !new RegExp(item.href).test(pathname),
                    },
                  )}
                >
                  <item.icon
                    className={cn('mr-3 flex-shrink-0 h-6 w-6', {
                      ' text-black group-hover:text-white': !new RegExp(
                        item.href,
                      ).test(pathname),
                      ' text-white': new RegExp(item.href).test(pathname),
                    })}
                    aria-hidden="true"
                  />
                  {item.name}
                  {}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="md:pl-64 flex flex-col h-screen">
        <div className="sticky top-0 z-10 flex-shrink-0 flex backdrop-blur-sm bg-gray-100/50 h-14">
          <div className="px-4 sm:px-6 md:px-8 flex w-full justify-between items-center">
            {matchingPathHeader && (
              <h1 className="text-xl text-primary font-semibold">
                {matchingPathHeader}
              </h1>
            )}
            <div className="ml-4 flex items-center md:ml-6">
              <div>
                <Badge>Free Tier</Badge>
                <Button variant="link" size="sm" asChild>
                  <Link href="/carer/upgrade">Upgrade</Link>
                </Button>
              </div>
              <Notification />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage src={profile_photo} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[10rem] p-3">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuItem asChild className="text-base">
                    <Link href="/carer/profile">
                      <UserIcon className="mr-2 w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-base">
                    <Link href="/carer/profile/favorites">
                      <HeartIcon className="mr-2 w-4 h-4" />
                      <span>Favorites</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/logout">
                      <LogOutIcon className="mr-2 w-4 h-4" />
                      <span>Logout</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <main className="flex-1 flex flex-col bg-gray-50">
          <div className="py-6 flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col h-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
