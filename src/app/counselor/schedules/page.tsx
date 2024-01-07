import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileTextIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { getAppointments } from '@/services/appointments';
import { z } from 'zod';
import AppointmentsCalendar from './AppointmentsCalendar';
import { format, isSameDay } from 'date-fns';
import { formatDateTime } from '@/lib/utils';

const searchParamsSchema = z.object({
  date: z.string().datetime().catch(new Date().toISOString()),
});

export default async function Schedules({
  searchParams: _searchParams,
}: {
  searchParams: unknown;
}) {
  const params = searchParamsSchema.parse(_searchParams);
  const { results: appointments } = await getAppointments();
  const appointmentsForDate = appointments.filter((appointment) =>
    isSameDay(new Date(appointment.appointment_time), new Date(params.date)),
    
  );

  return (
    <div className="space-y-4">
      {/* <pre>{JSON.stringify(appointments, null, 2)}</pre> */}
      <section>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Calendar</CardTitle>
            <Button asChild>
              <Link href="/counselor/schedules/new">
                <span>
                  <PlusIcon />
                </span>
                <span>Add Availability</span>
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <AppointmentsCalendar appointments={appointments} />
          </CardContent>
        </Card>
      </section>
      <section className="flex flex-col lg:flex-row gap-4 lg:items-start">
        <Card className="lg:w-48 shrink-0">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              Patients in Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-7xl font-bold text-primary text-center">
              {appointmentsForDate.length}
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-xl">
              List of Patients for{' '}
              {format(new Date(params.date), 'MMMM dd, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appointmentsForDate.length === 0 && (
              <div className="text-center aspect-w-16 aspect-h-9">
                <div className="flex justify-center flex-col">
                  <FileTextIcon
                    aria-hidden="true"
                    className="mx-auto h-12 w-12 text-gray-400"
                  />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">
                    No Appointments
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    When your patients books an appointment for the day, they
                    will appear here.
                  </p>
                </div>
              </div>
            )}
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {appointmentsForDate.map((appointment, index) => (
                <li key={index}>
                  <article className="flex flex-col xl:flex-row gap-4 items-start xl:items-center rounded-lg bg-gray-100 py-2.5 px-4">
                    <div className="w-10 h-10 overflow-hidden shrink-0 rounded-full">
                      <img
                        className="w-full h-full object-contain"
                        src={appointment.carer.user.profile_photo ?? ''}
                        alt={`${appointment.carer.user.first_name} ${appointment.carer.user.last_name}`}
                      />
                    </div>
                    <div>
                      <h1 className="text-sm leading-4 font-bold">
                        {appointment.carer.user.first_name}{' '}
                        {appointment.carer.user.last_name}
                      </h1>
                      <span className="text-sm leading-4 text-gray-500">
                        {formatDateTime(new Date(appointment.appointment_time))}
                      </span>
                      <p className="text-sm leading-4">
                        {appointment.call_code}
                      </p>
                    </div>
                    
                  </article>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
