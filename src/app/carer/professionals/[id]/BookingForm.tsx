'use client';

import { RadioGroupField } from '@/components/forms';
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
import { ErrorBoundary } from 'react-error-boundary';
import { timeStringToDateSchema } from '@/lib/schema-helpers';
import { formatTime, toPayloadDate, toPayloadTimeFormat } from '@/lib/utils';
import { restAPI } from '@/services/api';
import { getUserSession } from '@/services/auth';
import { Professional } from '@/services/professionals';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ClockIcon, FileTextIcon } from 'lucide-react';
import { getSession } from 'next-auth/react';
import { ReactNode, Suspense } from 'react';
import { Item, ListBox } from 'react-aria-components';
import { Control, Controller, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

const schema = z.object({
  type: z.string().nonempty(),
  date: z.coerce.date(),
  timeslotId: z.coerce.number({ invalid_type_error: 'Select a timeslot' }),
});
type FormFields = z.infer<typeof schema>;

const payloadSchema = z.object({
  carer_id: z.coerce.number(),
  professional_id: z.coerce.number(),
  schedule_id: z.coerce.number(),
  appointment_date: z.coerce.date(),
  type: z.string(),
});
type Payload = z.infer<typeof payloadSchema>;
const useCreatAppointment = () =>
  useMutation((payload: Payload) =>
    restAPI.url('/appointments').post({
      // carer_id: payload.carer_id,
      professional_id: payload.professional_id,
      schedule_id: payload.schedule_id,
      appointment_date: toPayloadDate(payload.appointment_date),
    }),
  );

export default function BookingForm({
  professional,
  initialValues = {},
}: {
  professional: Professional;
  initialValues?: Partial<FormFields>;
}) {
  const router = useRouter();
  const form = useForm<FormFields>({
    defaultValues: { date: new Date(), ...initialValues },
    resolver: zodResolver(schema),
  });

  const createAppointment = useCreatAppointment();
  const toast = useToast();
  const onSubmit = form.handleSubmit(async (data) => {
    const session = await getSession();
    if (!session) {
      return;
    }
    return createAppointment.mutateAsync(
      {
        professional_id: 1,
        carer_id: session.user.id,
        schedule_id: data.timeslotId,
        appointment_date: data.date,
        type: data.type,
      },
      {
        onSuccess() {
          toast.toast({
            title: 'Scheduled!',
            description: 'Your have scheduled an appointment.',
          });
          router.push('/carer/profile/appointments');
        },
        onError() {
          toast.toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to schedule an appointment.',
          });
        },
      },
    );
  });
  const isSubmitting = form.formState.isSubmitting;

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Schedule Counseling</CardTitle>
          <CardDescription>
            Complete the form to schedule an appointment.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-6">
          <div className="col-span-full">
            <RadioGroupField control={form.control} field="type">
              <div className="relative flex gap-4">
                <Card className="flex-1 group-data-[invalid]:border-red-500">
                  <RadioGroupField.Radio
                    value="in_person"
                    className="h-full p-6"
                  >
                    <div>
                      <RadioGroupField.Title>
                        Face to Face
                      </RadioGroupField.Title>
                      <RadioGroupField.Description slot="radioDescription">
                        A direct, in-person session with{' '}
                        {professional.first_name}.
                      </RadioGroupField.Description>
                    </div>
                  </RadioGroupField.Radio>
                </Card>
                <Card className="flex-1 group-data-[invalid]:border-red-500">
                  <CardHeader className="flex flex-row items-center h-full space-y-0 gap-2">
                    <RadioGroupField.Radio value="online" className="h-full">
                      <div>
                        <RadioGroupField.Title>
                          Virtual Meeting
                        </RadioGroupField.Title>
                        <RadioGroupField.Description slot="radioDescription">
                          Connect with {professional.first_name} and share your
                          thoughts, wherever you are.
                        </RadioGroupField.Description>
                      </div>
                    </RadioGroupField.Radio>
                  </CardHeader>
                </Card>
              </div>
            </RadioGroupField>
          </div>
          <div className="flex gap-4 col-span-full">
            <div>
              <Controller
                control={form.control}
                name="date"
                render={({ field }) => (
                  <Calendar
                    mode="single"
                    selected={field.value}
                    fromDate={new Date()}
                    onSelect={(day) => !!day && field.onChange(day)}
                    className="rounded-md border"
                  />
                )}
              />
            </div>
            <ErrorBoundary
              fallback={
                <div className="text-center flex-1 flex flex-col justify-center">
                  <ClockIcon
                    aria-hidden="true"
                    className="mx-auto h-12 w-12 text-red-400"
                  />
                  <h3 className="mt-2 text-sm font-semibold text-red-900">
                    Error
                  </h3>
                  <p className="mt-1 text-sm text-red-500">
                    Failed to get timeslots for date. Refresh page and try
                    again.
                  </p>
                </div>
              }
            >
              <Suspense fallback={<div>Loading</div>}>
                <AvailableTimeSlots
                  professionalId={professional.professional.id}
                  professionalEmail={professional.email}
                  control={form.control}
                >
                  {(timeslots) => (
                    <RadioGroupField control={form.control} field="timeslotId">
                      <ListBox
                        className="grid grid-cols-3 gap-4"
                        renderEmptyState={() => (
                          <div className="text-center">
                            <ClockIcon
                              aria-hidden="true"
                              className="mx-auto h-12 w-12 text-gray-400"
                            />
                            <h3 className="mt-2 text-sm font-semibold text-gray-900">
                              No Timeslots for this date
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Select another date to check its timeslot.
                            </p>
                          </div>
                        )}
                        selectionMode="none"
                      >
                        {timeslots.map((slot) => (
                          <Item key={String(slot.schedule_id)}>
                            <RadioGroupField.Radio
                              value={String(slot.schedule_id)}
                              className="border rounded-lg p-3 data-[selected]:bg-primary data-[selected]:text-white"
                              withIndicator={false}
                            >
                              <RadioGroupField.Title>
                                {formatTime(slot.start_time)} -{' '}
                                {formatTime(slot.end_time)}
                              </RadioGroupField.Title>
                            </RadioGroupField.Radio>
                          </Item>
                        ))}
                      </ListBox>
                    </RadioGroupField>
                  )}
                </AvailableTimeSlots>
              </Suspense>
            </ErrorBoundary>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            Schedule Appointment
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

const timeSlotSchema = z.object({
  schedule_id: z.coerce.number(),
  start_time: timeStringToDateSchema,
  end_time: timeStringToDateSchema,
});

const availableTimeSlotSchema = z.record(
  z.string(),
  z.record(z.string(), timeSlotSchema.array()),
);

type TimeSlot = z.infer<typeof timeSlotSchema>;
type AvailableTimeslots = z.infer<typeof availableTimeSlotSchema>;

function AvailableTimeSlots({
  professionalId,
  professionalEmail,
  control,
  children,
}: {
  professionalId: number;
  professionalEmail: string;
  control: Control<FormFields>;
  children: (slots: TimeSlot[]) => ReactNode;
}) {
  const date = useWatch({ control, name: 'date', defaultValue: new Date() });
  const query = useQuery<AvailableTimeslots[]>(
    ['appointment-time-slots', date.toDateString()],
    async () =>
      availableTimeSlotSchema.array().parse(
        await restAPI
          .url('/appointments/available-timeslots')
          .query({
            start_date: toPayloadDate(date),
            end_date: toPayloadDate(date),
            professional_id: professionalId,
          })
          .get(),
      ),
    {
      suspense: true,
    },
  );
  const data =
    query.data?.find((item) => item?.[professionalEmail])?.[
      professionalEmail
    ]?.[toPayloadDate(date)] ?? [];

  return <>{children(data)}</>;
}
