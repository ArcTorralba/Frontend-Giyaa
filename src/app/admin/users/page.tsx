import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { restAPI } from '@/services/api';
import { userSchema } from '@/services/users';
import { toPaginatedSchema } from '@/services/utils';
import { PlusIcon, Trash } from 'lucide-react';

import Link from 'next/link';
import { z } from 'zod';

const searchParamsSchema = z.object({
  page: z.coerce.number().catch(1),
  per_page: z.coerce.number().catch(10),
});

export type User = z.infer<typeof userSchema>;

export const revalidate = 0;
export default async function Users(props: { searchParams: any }) {
  const searchParams = searchParamsSchema.parse(props.searchParams);
  const { results: users, ...meta } = toPaginatedSchema(userSchema).parse(
    await restAPI
      .query({ page: searchParams.page, user_type: 'professional' })
      .get('/users'),
  );

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription className="mt-2">
                Configure you users.
              </CardDescription>
            </div>
            <Button
              asChild
              slotLeft={
                <span>
                  <PlusIcon className="w-4 h-4" />
                </span>
              }
            >
              <Link href="users/new">
                <span>Add Professional</span>
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table className="relative">
            <TableCaption className="sr-only">
              A list of your users.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Profession</TableHead>
                <TableHead className="text-right relative">
                  <span className="sr-only">Action</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <Link href={`./users/${user.id}/update`}>{user.id}</Link>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.email}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="justify-end w-full">
          <Pagination totalItems={meta.count} />
        </CardFooter>
      </Card>
    </div>
  );
}
