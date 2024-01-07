'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/services/users';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UserProfile() {
  const query = useCurrentUser();
  const user = query.data;
  console.log('user', user)
  if (!user) {
    return null;
  }

  return (
    <div>
      <div className="-mx-4 sm:-mx-6 md:-mx-8 -mt-6">
        <section className="from-primary to-[#1AB08B] bg-gradient-to-b pb-20 pt-10 px-10 space-y-10">
          <Button
            asChild
            variant="ghost"
            className="whitespace-nowrap text-white"
          >
            <Link href=".">
              <span>
                <ArrowLeft className="w-4 h-4" />
              </span>
              <span>Go Back</span>
            </Link>
          </Button>
          <div className="flex gap-10">
            <Avatar className="w-48 h-48">
              <AvatarImage src={user.profile_photo} />
              <AvatarFallback>
                {[user.first_name, user.last_name].map((v) => v[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-3xl font-semibold text-white tracking-tight transition-colors first:mt-0">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-base text-white">
                {user?.description ??
                  'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Neque corrupti tempora et impedit deleniti obcaecati dolorum laboriosam dolores magni, voluptates sit. Modi fuga, doloremque adipisci impedit cupiditate natus maxime tempora.'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
