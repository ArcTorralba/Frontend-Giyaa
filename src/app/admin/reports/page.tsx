import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, PlusIcon, Trash } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function Users() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reported Products</CardTitle>
        <CardDescription>Manage reported products</CardDescription>
      </CardHeader>
      <CardContent>
        <Table className="relative">
          <TableCaption className="sr-only">
            A list of your reports.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Reported Issue</TableHead>
              <TableHead className="text-right relative">
                <span className="sr-only">Action</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Counselor</TableCell>
              <TableCell>counsleor@gmail.com</TableCell>
              <TableCell className="text-right">
                <Button
                  title="Delete user"
                  variant="destructive"
                  className="w-8 h-8 p-0"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
