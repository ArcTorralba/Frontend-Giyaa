import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDateTime } from '@/lib/utils';
import { getAppointments } from '@/services/appointments';
import { getUser } from '@/services/users';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export default async function HomePage() {
  const user = await getUser();
  const { results: appointments } = await getAppointments({
    carer_id: user.carer_id ?? 0,
  });
  const enterRoom = async (formData: FormData) => {
    'use server';
    const code = z.coerce.string().parse(formData.get('code'));
    redirect(`/counselor/home/counseling/${code}`);
  };

  return (
    <div className="flex-1 flex items-center gap-10">
      <div>
        <div>
          <h2 className="text-4xl font-semibold text-gray-900">
            Secure video conferencing for counseling
          </h2>
          <p className="text-lg mt-3 text-gray-500">
            Connect and council from anywhere with Giya
          </p>
        </div>
        <div className="grid gap-4">
          <form action={enterRoom} className="flex gap-4 mt-14">
            <Label className="relative">
              <span className="sr-only">Meeting code</span>
              <Input
                type="text"
                name="code"
                required
                placeholder="Enter code"
              />
            </Label>
            <Button type="submit">Join</Button>
          </form>

          {appointments.length !== 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Counselor</TableHead>
                  <TableHead>Code</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <Badge>{appointment.status.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell>
                      {/*We adjust -8 hours since the value does not convert to UTC  */}
                      {formatDateTime(new Date(appointment.appointment_time))}
                    </TableCell>
                    <TableCell>
                      {appointment.call_code}{' '}
                      <Link
                        href={`/carer/home/counseling/${appointment.call_code}`}
                        className={buttonVariants({
                          size: 'xs',
                          variant: 'link',
                        })}
                      >
                        Enter Room
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Appointments</CardTitle>
                <CardDescription>
                  Create one by clicking the link below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="professionals" className={buttonVariants({})}>
                  Create Appointment
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <div className="max-w-2xl">
        <img src="/conferencing.png" alt="Girl video conferencing" />
      </div>
    </div>
  );
}
