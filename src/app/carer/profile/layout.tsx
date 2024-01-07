'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrentUser } from '@/services/users';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function Layout({
  // children,
  tabs,
}: {
  // children: React.ReactNode;
  tabs: React.ReactNode;
}) {
  const pathname = usePathname();
  const defaultTabValue = pathname;
  const query = useCurrentUser();
  const user = query.data;

  if (!user) {
    return null;
  }

  return (
    <div>
      <div>
        <Button asChild variant="link" className="mb-4">
          <Link href=".">
            <span>
              <ArrowLeft className="w-4 h-4" />
            </span>
            <span>Go Back</span>
          </Link>
        </Button>
        <Card className="overflow-hidden">
          {/* <span className="from-primary to-[#1AB08B] bg-gradient-to-b block" /> */}
          <CardContent className="pt-6">
            <div className="space-y-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user.profile_photo} />
                <AvatarFallback>
                  {[user.first_name, user.last_name].map((v) => v[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex gap-1">
                      <h2 className="text-lg font-semibold  tracking-tight transition-colors first:mt-0">
                        {user.first_name} {user.last_name}
                      </h2>
                      <Badge>Free Tier</Badge>
                    </div>
                    <div className="text-base text-gray-500 mt-1">
                      {user.email}
                    </div>
                  </div>
                  <Button variant="secondary" asChild>
                    <Link href="/carer/settings">Edit Profile</Link>
                  </Button>
                </div>
                <p className="text-base ">{/* {user.description} */}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <section className="mt-5 grid gap-4">
        <Tabs defaultValue={defaultTabValue} value={defaultTabValue}>
          <TabsList>
            <TabsTrigger value="/carer/profile/appointments" asChild>
              <Link href="/carer/profile/appointments">Appointments</Link>
            </TabsTrigger>
            <TabsTrigger value="/carer/profile/favorites" asChild>
              <Link href="/carer/profile/favorites">Favorites</Link>
            </TabsTrigger>
            <TabsTrigger value="/carer/profile/my-products" asChild>
              <Link href="/carer/profile/my-products">My Products</Link>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab-content" forceMount className="py-5">
            {tabs}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
