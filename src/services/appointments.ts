import { timeStringToDateSchema } from '@/lib/schema-helpers';
import { z } from 'zod';
import { userSchema } from './users';
import { professionSchema } from './constants';
import { restAPI } from './api';
import { toPaginatedSchema } from './utils';
import { removeEmptyProperties } from '@/lib/utils';
import { subHours } from 'date-fns';

export const APPOINTMENT_STATUS_VALUES = {
  pending: 'pending',
  confirmed: 'confirmed',
  canceled: 'canceled',
  completed: 'completed',
} as const;
export const appointmentStatusSchema = z.nativeEnum(APPOINTMENT_STATUS_VALUES);

export const timeSlotSchema = z.object({
  schedule_id: z.coerce.number(),
  start_time: timeStringToDateSchema,
  end_time: timeStringToDateSchema,
});

export const professionalAvailableTimeSlots = z.record(
  z.string(),
  timeSlotSchema.array(),
);
export const availableTimeSlotSchema = z.record(
  z.string(),
  professionalAvailableTimeSlots,
);

export type TimeSlot = z.infer<typeof timeSlotSchema>;
export type ProfessionalAvailableTimeslots = z.infer<
  typeof professionalAvailableTimeSlots
>;
export type AvailableTimeslots = z.infer<typeof availableTimeSlotSchema>;

export const appointmentSchema = z.object({
  id: z.coerce.number(),
  carer: z.object({
    id: z.coerce.number(),
    user: userSchema.omit({ is_staff: true }),
  }),
  professional: z.object({
    id: z.coerce.number(),
    user: userSchema.omit({ is_staff: true }),
    profession: professionSchema,
  }),
  schedule: z.object({
    id: z.coerce.number(),
    day_of_week: z.number(),
    day_of_week_display: z.string(),
    start_time: timeStringToDateSchema,
    end_time: timeStringToDateSchema,
    professional: z.coerce.number(),
  }),
  appointment_time: z
    .string()
    .datetime()
    .transform((v) => subHours(new Date(v), 8).toISOString()),
  status: appointmentStatusSchema,
  call_code: z.string(),
});

export type Appointment = z.infer<typeof appointmentSchema>;
const appointmentParams = z.object({
  carer_id: z.coerce.number(),
  professional_id: z.coerce.number(),
});
export const getAppointments = async (
  params?: Partial<z.infer<typeof appointmentParams>>,
) => {
  const response = await restAPI
    .url('/appointments')
    .query(removeEmptyProperties(params ?? {}))
    .get();
  return toPaginatedSchema(appointmentSchema).parse(response);
};

export const cancelAppointment = async (appointmentId: number) => {
  const response = await restAPI
    .url(`/appointments/${appointmentId}/cancel`)
    .post();
  return appointmentSchema.parse(response);
};

