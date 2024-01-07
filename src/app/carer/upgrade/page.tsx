import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { priceFormatter } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { z } from 'zod';
const isNumber = (v: unknown) => z.coerce.number().safeParse(v).success;

export default function ToolkitSubscribe() {
  return (
    <div className="space-y-5">
      <Button asChild variant="ghost" className="whitespace-nowrap">
        <Link href=".">
          <span>
            <ArrowLeft className="w-4 h-4" />
          </span>
          <span>Go Back</span>
        </Link>
      </Button>
      <div className="w-full flex flex-col items-center">
        <h2 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight transition-colors">
          <span className="text-primary">Flexible</span> <span>Plans</span>
        </h2>
        <p className="leading-7 text-gray-500">
          Choose a plan that benefits you the most.
        </p>
      </div>
      <ul className="grid grid-cols-3 gap-10">
        {[
          {
            price: 'Free',
            perk: '',
          },
          {
            price: '299',
            perk: 'Have a chance to be prioritize in counseling session of the counselor',
          },
          {
            price: '1499',
            perk: 'Have a chance to be prioritize in counseling session of the counselor',
          },
        ].map(({ price, perk }, index) => (
          <li key={`${index}`}>
            <Card className="group flex h-full flex-col hover:bg-primary rounded-2xl overflow-hidden">
              <CardHeader className="text-center">
                <CardTitle className="text-sm font-medium group-hover:text-white">
                  Basic
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardTitle className="group-hover:text-white text-4xl text-primary">
                  {isNumber(price)
                    ? priceFormatter().format(Number(price))
                    : price}
                </CardTitle>
                <div className="mt-12 ">
                  <CardDescription className="group-hover:text-gray-100">
                    All free features in app are available in this subscription
                  </CardDescription>
                  <div className="mt-10">
                    {perk && (
                      <>
                        <div className="text-primary text-base group-hover:text-gray-100">
                          Additional
                        </div>
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-gray-100">
                          {perk}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex mt-auto justify-center">
                <Button variant="secondary" className="w-full">
                  Subscribe
                </Button>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
