import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

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
        {Array.from({ length: 3 }).map((_, index) => (
          <li key={`${index}`}>
            <Card className="group hover:bg-primary rounded-2xl overflow-hidden">
              <CardHeader className="text-center">
                <CardTitle className="text-sm font-medium group-hover:text-white">
                  Basic
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardTitle className="group-hover:text-white text-4xl">
                  Free
                </CardTitle>
                <div className="mt-12 ">
                  <CardDescription className="group-hover:text-gray-100">
                    All free features in app are available in this subscription
                  </CardDescription>
                  <div className="mt-10">
                    <div className="text-primary text-base group-hover:text-gray-100">
                      Additional
                    </div>
                    <p className="text-sm font-medium text-muted-foreground group-hover:text-gray-100">
                      All of the modules of the toolkit are available in this
                      subscription
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
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
