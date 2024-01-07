'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FormControl } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { zodResolver } from '@hookform/resolvers/zod';
import { SelectContent, SelectItem } from '@radix-ui/react-select';
import { ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const appointments = [
  {
    invoice: 'INV001',
    paymentStatus: 'Paid',
    totalAmount: '$250.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV002',
    paymentStatus: 'Pending',
    totalAmount: '$150.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV003',
    paymentStatus: 'Unpaid',
    totalAmount: '$350.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV004',
    paymentStatus: 'Paid',
    totalAmount: '$450.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV005',
    paymentStatus: 'Paid',
    totalAmount: '$550.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV006',
    paymentStatus: 'Pending',
    totalAmount: '$200.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV007',
    paymentStatus: 'Unpaid',
    totalAmount: '$300.00',
    paymentMethod: 'Credit Card',
  },
];

export default function UserProfile() {
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
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-3xl font-semibold text-white tracking-tight transition-colors first:mt-0">
                Maria Sarah Villa
              </h2>
              <p className="text-base text-white">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Neque
                corrupti tempora et impedit deleniti obcaecati dolorum
                laboriosam dolores magni, voluptates sit. Modi fuga, doloremque
                adipisci impedit cupiditate natus maxime tempora.
              </p>
            </div>
          </div>
        </section>
      </div>
      <section className="mt-10 grid gap-4">
        <h1 className="text-lg font-semibold">Confirmed Appointments</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Counselor</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.invoice}>
                <TableCell className="font-medium">
                  {appointment.invoice}
                </TableCell>
                <TableCell>{appointment.paymentStatus}</TableCell>
                <TableCell>{appointment.paymentMethod}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
