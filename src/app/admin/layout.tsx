'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useCurrentUser } from '@/services/users';
import {
  FileVideoIcon,
  FlagIcon,
  HeartIcon,
  LogOutIcon,
  MenuIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navigation = [
  { name: 'Users', href: '/admin/users', icon: UsersIcon },
  { name: 'Toolkits', href: '/admin/toolkits', icon: FileVideoIcon },
  { name: 'Reports', href: '/admin/reports', icon: FlagIcon },
  { name: 'Settings', href: '/admin/settings', icon: SettingsIcon },
  // { name: 'Profile', href: '/admin/profile', icon: UserIcon },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile_photo = useCurrentUser().data?.profile_photo ?? '';
  const pathname = usePathname();
  const matchingPathHeader =
    navigation.find((item) =>
      item.name ? new RegExp(item.href).test(pathname) : false,
    )?.name ?? '';

  return (
    <div>
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-center shrink-0 px-6">
              <img className="w-28 h-auto" src="/giya.svg" alt="Giya" />
            </div>
            <nav className="mt-5 flex-1 px-6 space-y-1">
              {navigation.map((item) => {
                const matches = new RegExp(item.href).test(pathname);
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-5 py-3 text-sm font-medium rounded-md',
                      {
                        'bg-primary rounded-full text-white': matches,
                        'text-black hover:text-white hover:bg-primary rounded-full hover:bg-opacity-75':
                          !matches,
                      },
                    )}
                  >
                    <item.icon
                      className={cn('mr-3 flex-shrink-0 h-6 w-6', {
                        ' text-black group-hover:text-white': !matches,
                        ' text-white': matches,
                      })}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                );
              })}
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
              // <div className="px-4 sm:px-6 md:px-8">
              // </div>
            )}
            <div className="ml-4 flex items-center md:ml-6">
              {/* <div>
                <Badge>Free Tier</Badge>
                <Button variant="link" size="sm" asChild>
                  <Link href=".">Upgrade</Link>
                </Button>
              </div> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar>
                      <AvatarImage src={profile_photo} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/carer/profile">
                      <UserIcon className="mr-2 w-4 h-4" />
                      <span>Profile</span>
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
