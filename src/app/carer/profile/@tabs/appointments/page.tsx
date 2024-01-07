'use client';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDateTime } from '@/lib/utils';
import { getAppointments, cancelAppointment  } from '@/services/appointments';
import { getUser } from '@/services/users';
import { subHours } from 'date-fns';

enum Professions {
  'counselor' = 'Counselor',
  'psychologist' = 'Psychologist',
}

export default async function UserAppointments() {
  const user = await getUser();
  const { results: appointments } = await getAppointments({
    carer_id: user.carer_id ?? 0,
  });
  
  const handleCancelAppointment = async (appointmentId: number) => {
    try {
      await cancelAppointment(appointmentId);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };
  

  return (
    <div className="space-y-5">
      <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Your Appointments
      </h2>
      {/* <pre>{JSON.stringify(appointments, null, 2)}</pre> */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Counselor</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Code</TableHead>
             <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>
                <Badge>{appointment.status.toUpperCase()}</Badge>
              </TableCell>
              <TableCell className="font-medium">
                {appointment.professional.user.first_name}{' '}
                {appointment.professional.user.last_name}
                {' - '}
                {appointment.professional.user.email}
              </TableCell>
              <TableCell>
                {Professions[appointment.professional.profession]}
              </TableCell>
              <TableCell>
                {/*We adjust -8 hours since the value does not convert to UTC  */}
                {formatDateTime(new Date(appointment.appointment_time))}
              </TableCell>
              <TableCell>
                {/*We adjust -8 hours since the value does not convert to UTC  */}
                {appointment.call_code}
              </TableCell>
                <TableCell>
              <button onClick={() => handleCancelAppointment(appointment.id)}>
                Cancel
              </button>
            </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
