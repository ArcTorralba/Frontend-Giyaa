'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { timeStringToDateSchema } from '@/lib/schema-helpers';
import { toPayloadDate, toPayloadTimeFormat } from '@/lib/utils';
import { restAPI } from '@/services/api';
import {
  AvailableTimeslots,
  availableTimeSlotSchema,
  timeSlotSchema,
} from '@/services/appointments';
import { useCurrentUser } from '@/services/users';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
// import { useToasts } from '@/components/ui/use-toast';
import {
  addHours,
  eachHourOfInterval,
  format,
  getDay,
  isEqual,
  isSameDay,
  set,
} from 'date-fns';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { eachDayOfInterval, eachWeekOfInterval, addDays, addWeeks } from 'date-fns';

const schema = z.object({
  date: z.coerce.date(),
  repeatType: z.string(),
  selectedSlots: z.coerce.date().array(),
  savedSlots: z.record(
    z.string(),
    timeSlotSchema
      .extend({ start_time: z.coerce.date(), end_time: z.coerce.date() })
      .array(),
  ),
});
type FormFields = z.infer<typeof schema>;

const payloadSchema = z.object({
  day_of_week: z.coerce.number(),
  start_time: timeStringToDateSchema,
  end_time: timeStringToDateSchema,
});
type Payload = z.infer<typeof payloadSchema>;
const useCreateAppointmentSlot = () =>
  useMutation((payloads: Payload[]) =>
    Promise.all(
      payloads.map((payload) =>
        restAPI.url(`/users/professionals/schedules`).post({
          day_of_week: payload.day_of_week,
          start_time: toPayloadTimeFormat(payload.start_time, {
            includeSeconds: true,
          }),
          end_time: toPayloadTimeFormat(payload.end_time, {
            includeSeconds: true,
          }),
        }),
      ),
    ),
  );

const useDeleAppointmentSlot = () =>
  useMutation((payloads: number[]) =>
    Promise.all(
      payloads.map((id) =>
        restAPI.url(`/users/professionals/schedules/${id}`).delete(),
      ),
    ),
  );

const getRemappedDayIndex = (index: number) => {
  const remapped = {
    0: 6,
    1: 0,
    2: 1,
    3: 2,
    4: 3,
    5: 4,
    6: 5,
  }[index];
  return remapped ?? 0;
};

export default function NewSchedule() {
  const user = useCurrentUser().data;
  const professional_id = user?.professional_id ?? 0;

  const query =
    useQuery<AvailableTimeslots[]>(
      ['appointment-time-slots'],
      async () =>
        availableTimeSlotSchema.array().parse(
          await restAPI
            .url('/appointments/available-timeslots')
            .query({
              professional_id,
            })
            .get(),
        ),
      {
        // suspense: true,
        keepPreviousData: false,
        enabled: professional_id !== 0,
        cacheTime: 0,
      },
    ) ?? [];
  const email = user?.email ?? '';
  const data = query.data?.find((item) => !!item?.[email])?.[email];

  if (!data) {
    return null;
  }

  return (
    <TimeslotForm
      initialValues={{
        date: new Date(),
        savedSlots: data,
        selectedSlots: Object.entries(data).reduce((acc, [key, value]) => {
          return [
            ...acc,
            ...value.map(
              (v) =>
                new Date(
                  `${key}T${toPayloadTimeFormat(v.start_time, {
                    includeSeconds: true,
                  })}`,
                ),
            ),
          ];
        }, [] as Date[]),
      }}
    />
  );
}

export function TimeslotForm({
  initialValues = {},
}: {
  initialValues?: Partial<FormFields>;
}) {
  const router = useRouter();
  const { handleSubmit, control, watch, formState, setValue } =
    useForm<FormFields>({
      resolver: zodResolver(schema),
      defaultValues: initialValues,
    });
  const toast = useToast();
  const date = watch('date');
  const repeatType = watch('repeatType');
  const iSubmitting = formState.isSubmitting;

  const close = () => {
    if (iSubmitting) {
      return;
    }
    router.push('/counselor/schedules');
  };

  const createAppointmentSlot = useCreateAppointmentSlot();
  const deleteAppointment = useDeleAppointmentSlot();
  const onSubmit = handleSubmit(async (data) => {
    const deletedSlots = data.savedSlots[toPayloadDate(data.date)].filter(
      (slot) =>
        !data.selectedSlots
          .filter((selectedSlot) => isSameDay(selectedSlot, data.date))
          .some(
            (selectedSlot) =>
              toPayloadTimeFormat(slot.start_time) ===
              toPayloadTimeFormat(selectedSlot),
          ),
    );
    const newSlots = data.selectedSlots
      .filter((selectedSlot) => isSameDay(selectedSlot, data.date))
      .filter(
        (selectedSlot) =>
          !data.savedSlots[toPayloadDate(data.date)].some(
            (slot) =>
              toPayloadTimeFormat(slot.start_time) ===
              toPayloadTimeFormat(selectedSlot),
          ),
      );
  
    if (data.repeatType === 'daily') {
      // Handle daily repetition logic here
      const datesToCreate = eachDayOfInterval({
        start: data.date,
        end: addDays(data.date, 30), // Repeat for 30 days, adjust as needed
      });
      await Promise.all(
        datesToCreate.map((repeatDate) =>
          createAppointmentSlot.mutateAsync(
            newSlots.map((slot) => ({
              day_of_week: getRemappedDayIndex(getDay(repeatDate)),
              start_time: set(repeatDate, {
                hours: slot.getHours(),
                minutes: slot.getMinutes(),
                seconds: slot.getSeconds(),
              }),
              end_time: addHours(
                set(repeatDate, {
                  hours: slot.getHours(),
                  minutes: slot.getMinutes(),
                  seconds: slot.getSeconds(),
                }),
                1,
              ),
            })),
          ),
        ),
      );
    } else if (data.repeatType === 'weekly') {
      // Handle weekly repetition logic here
      const datesToCreate = eachWeekOfInterval({
        start: data.date,
        end: addWeeks(data.date, 4), // Repeat for 4 weeks, adjust as needed
      });
      await Promise.all(
        datesToCreate.map((repeatDate) =>
          createAppointmentSlot.mutateAsync(
            newSlots.map((slot) => ({
              day_of_week: getRemappedDayIndex(getDay(repeatDate)),
              start_time: set(repeatDate, {
                hours: slot.getHours(),
                minutes: slot.getMinutes(),
                seconds: slot.getSeconds(),
              }),
              end_time: addHours(
                set(repeatDate, {
                  hours: slot.getHours(),
                  minutes: slot.getMinutes(),
                  seconds: slot.getSeconds(),
                }),
                1,
              ),
            })),
          ),
        ),
      );
    } else {
      // Handle non-repeating logic here
      await Promise.all([
        createAppointmentSlot.mutateAsync(
          newSlots.map((slot) => ({
            day_of_week: getRemappedDayIndex(getDay(data.date)),
            start_time: slot,
            end_time: addHours(slot, 1),
          })),
        ),
        deleteAppointment.mutateAsync(
          deletedSlots.map((slot) => slot.schedule_id),
        ),
      ]);
    }
  
    toast.toast({ description: 'Saved!' });
    close();
  });
  

  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Configure Availbility</DialogTitle>
          <DialogDescription>
            Set your avialable timeslot for particular dates
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex gap-4 py-4"
          id="availability-form"
          onSubmit={onSubmit}
        >
          <div>
            <Label>Select Date</Label>
            <Controller
              control={control}
              name="date"
              defaultValue={new Date()}
              render={({ field }) => (
                <Calendar
                  mode="single"
                  fromDate={new Date()}
                  selected={field.value}
                  onSelect={(selected) => {
                    if (selected) {
                      field.onChange(selected);
                    }
                  }}
                  initialFocus
                />
              )}
            />
          </div>
          <div>
          <Label>Select Repeat Type</Label>
            <Controller
              control={control}
              name="repeatType"
              defaultValue=""
              render={({ field }) => (
                <select {...field} className="form-select">
                  <option value="">No Repeat</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              )}
            />
          </div>
          <fieldset>
            <legend>
              Select timeslots for{' '}
              <span className="text-primary">
                {date ? format(date, 'MMMM dd, yyyy') : null}
              </span>
            </legend>
            <Controller
              control={control}
              name="selectedSlots"
              defaultValue={[]}
              render={({ field }) => (
                <ul className="space-y-4 mt-2">
                  <li className="space-y-2">
                    <div className="flex gap-1 items-center">
                      <div className="text-base font-medium">Morning Slots</div>
                      <Button
                        size="sm"
                        type="button"
                        variant="link"
                        onClick={() => {
                          const timeslots = eachHourOfInterval({
                            start: set(date, {
                              hours: 8,
                              minutes: 0,
                              seconds: 0,
                            }),
                            end: set(date, {
                              hours: 12,
                              minutes: 0,
                              seconds: 0,
                            }),
                          });
                          const hasSelectedAny = timeslots.some(
                            (slot) =>
                              !!field.value.find((item) => isEqual(item, slot)),
                          );
                          if (hasSelectedAny) {
                            field.value = field.value.filter(
                              (value) =>
                                !timeslots.some((slot) => isEqual(slot, value)),
                            );
                          } else {
                            timeslots.forEach((slot) => field.value.push(slot));
                          }

                          field.onChange(field.value);
                        }}
                      >
                        Select all
                      </Button>
                    </div>
                    <ul className="grid grid-cols-4 gap-4">
                      {eachHourOfInterval({
                        start: set(date, {
                          hours: 8,
                          minutes: 0,
                          seconds: 0,
                        }),
                        end: set(date, {
                          hours: 12,
                          minutes: 0,
                          seconds: 0,
                        }),
                      }).map((slot) => {
                        return (
                          <li
                            key={slot.toISOString()}
                            className="flex gap-1 items-center"
                          >
                            <Checkbox
                              id={`slot-${slot.toISOString()}`}
                              checked={field.value.some((item) =>
                                isEqual(item, slot),
                              )}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.value = [...field.value, slot];
                                } else {
                                  field.value = field.value.filter(
                                    (item) => !isEqual(item, slot),
                                  );
                                }
                                field.onChange(field.value);
                              }}
                            />
                            <label
                              htmlFor={`slot-${slot.toISOString()}`}
                              className="text-base font-medium leading-none select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {format(slot, 'hh:mm aa')}
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                  <li className="space-y-2">
                    <div className="flex gap-1 items-center">
                      <div className="text-base font-medium">
                        Afternoon Slots
                      </div>
                      <Button
                        size="sm"
                        variant="link"
                        type="button"
                        onClick={() => {
                          const timeslots = eachHourOfInterval({
                            start: set(date, {
                              hours: 13,
                              minutes: 0,
                              seconds: 0,
                            }),
                            end: set(date, {
                              hours: 17,
                              minutes: 0,
                              seconds: 0,
                            }),
                          });

                          const hasSelectedAny = timeslots.some(
                            (slot) =>
                              !!field.value.find((item) => isEqual(item, slot)),
                          );
                          if (hasSelectedAny) {
                            field.value = field.value.filter(
                              (value) =>
                                !timeslots.some((slot) => isEqual(slot, value)),
                            );
                          } else {
                            timeslots.forEach((slot) => field.value.push(slot));
                          }

                          field.onChange(field.value);
                        }}
                      >
                        Select all
                      </Button>
                    </div>
                    <ul className="grid grid-cols-4  gap-4">
                      {eachHourOfInterval({
                        start: new Date(`${toPayloadDate(date)}T13:00:00`),
                        end: set(date, {
                          hours: 17,
                          minutes: 0,
                          seconds: 0,
                        }),
                      }).map((slot) => (
                        <li
                          key={slot.toISOString()}
                          className="flex gap-1 items-center"
                        >
                          <Checkbox
                            id={`slot-${slot.toISOString()}`}
                            checked={field.value.some((item) =>
                              isEqual(item, slot),
                            )}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.value = [...field.value, slot];
                              } else {
                                field.value = field.value.filter(
                                  (item) => !isEqual(item, slot),
                                );
                              }
                              field.onChange(field.value);
                            }}
                          />
                          <label
                            htmlFor={`slot-${slot.toISOString()}`}
                            className="text-base font-medium leading-none select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {format(slot, 'hh:mm aa')}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="space-y-2">
                    <div className="flex gap-1 items-center">
                      <div className="text-base font-medium">Evening Slots</div>
                      <Button
                        size="sm"
                        variant="link"
                        type="button"
                        onClick={() => {
                          const timeslots = eachHourOfInterval({
                            start: set(date, {
                              hours: 18,
                              minutes: 0,
                              seconds: 0,
                            }),
                            end: set(date, {
                              hours: 21,
                              minutes: 0,
                              seconds: 0,
                            }),
                          });
                          const hasSelectedAny = timeslots.some(
                            (slot) =>
                              !!field.value.find((item) => isEqual(item, slot)),
                          );
                          if (hasSelectedAny) {
                            field.value = field.value.filter(
                              (value) =>
                                !timeslots.some((slot) => isEqual(slot, value)),
                            );
                          } else {
                            timeslots.forEach((slot) => field.value.push(slot));
                          }

                          field.onChange(field.value);
                        }}
                      >
                        Select all
                      </Button>
                    </div>
                    <ul className="grid grid-cols-4 gap-4">
                      {eachHourOfInterval({
                        start: set(date, {
                          hours: 18,
                          minutes: 0,
                          seconds: 0,
                        }),
                        end: set(date, {
                          hours: 21,
                          minutes: 0,
                          seconds: 0,
                        }),
                      }).map((slot) => (
                        <li
                          key={slot.toISOString()}
                          className="flex gap-1 items-center"
                        >
                          <Checkbox
                            id={`slot-${slot.toISOString()}`}
                            checked={field.value.some((item) =>
                              isEqual(item, slot),
                            )}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.value = [...field.value, slot];
                              } else {
                                field.value = field.value.filter(
                                  (item) => !isEqual(item, slot),
                                );
                              }
                              field.onChange(field.value);
                            }}
                          />
                          <label
                            htmlFor={`slot-${slot.toISOString()}`}
                            className="text-base font-medium leading-none select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {format(slot, 'hh:mm aa')}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              )}
            />
          </fieldset>
        </form>
        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={close}
            disabled={iSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" form="availability-form" disabled={iSubmitting}>
            Save Availability
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
