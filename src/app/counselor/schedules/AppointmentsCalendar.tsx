'use client';

import { format, isSameDay } from 'date-fns';
import { useRef } from 'react';
import {
  DayProps,
  useActiveModifiers,
  useDayPicker,
  useDayRender,
} from 'react-day-picker';

import DatePicker from '@/components/DatePicker';
// import { getWeekdays } from 'components/DatePickers/utils';
import addDays from 'date-fns/addDays';
import startOfWeek from 'date-fns/startOfWeek';

import { cn } from '@/lib/utils';
import { Appointment } from '@/services/appointments';
import type { Locale } from 'date-fns';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';

// https://github.com/gpbl/react-day-picker/blob/master/packages/react-day-picker/src/components/Head/utils/getWeekdays.ts
/**
 * Generate a series of 7 days, starting from the week, to use for formatting
 * the weekday names (Monday, Tuesday, etc.).
 */
export function getWeekdays(
  locale?: Locale,
  /** The index of the first day of the week (0 - Sunday) */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6,
): Date[] {
  const start = startOfWeek(new Date(), { locale, weekStartsOn });
  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = addDays(start, i);
    days.push(day);
  }
  return days;
}

const today = new Date();
const searchParamsSchema = z.object({
  date: z.string().datetime().catch(new Date().toISOString()),
});

export default function AppointmentsCalendar({
  appointments,
  selected: selectedDate,
  onMonthChange: handleMonthChange,
  onSelected,
}: {
  appointments: Appointment[];
  selected?: Date;
  onSelected?: (dates: Date | undefined) => void;
  onMonthChange?: (date: Date) => void;
}) {
  const searchParams = useSearchParams();
  const searchParamsValues = searchParamsSchema.parse(
    Object.fromEntries(searchParams.entries()),
  );
  const date = searchParamsValues.date;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <DatePicker
      components={{
        // Row: SquareRow,
        // Day: CustomDay,
        Day: (props) => (
          <CustomDay
            {...props}
            appointments={appointments.filter((appointment) =>
              isSameDay(new Date(appointment.appointment_time), props.date),
            )}
          />
        ),
        Head: CustomHead,
      }}
      onMonthChange={handleMonthChange}
      onSelect={(day) => {
        onSelected && onSelected(day);
        if (day) {
          router.replace(`${pathname}?date=${day.toISOString()}`);
        }
      }}
      disabled={{
        before: today,
      }}
      selected={new Date(date)}
      mode="single"
      classNames={{
        root: 'w-full border-gray-50 [--rdp-cell-size:80px]',
        months: 'w-full',
        table: 'w-full border border-gray-100 rounded mt-4',
        tbody: 'divide-y',
        row: 'divide-x',
      }}
    />
  );
}
function CustomHead() {
  const {
    locale,
    labels: { labelWeekday },
  } = useDayPicker();

  const weekdays = getWeekdays(locale);

  return (
    <thead className="border-b">
      <tr className="divide-x">
        {weekdays.map((weekday, i) => (
          <th
            key={i}
            scope="col"
            className="p-3 py-2 text-left text-black relative uppercase tracking-wider"
          >
            <span aria-hidden={true}>{format(weekday, 'ccc')}</span>
            <span className="sr-only">{labelWeekday(weekday, { locale })}</span>
          </th>
        ))}
      </tr>
    </thead>
  );
}

function CustomDay({
  date,
  displayMonth,
  appointments,
}: DayProps & { appointments: Appointment[] }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const day = format(date, 'EEE');
  const isWeekend = day === 'Sat' || day === 'Sun';
  const dayRender = useDayRender(date, displayMonth, buttonRef);
  const { selected, today, outside, disabled, hidden } = useActiveModifiers(
    date,
    displayMonth,
  );
  const { children, ...buttonProps } = dayRender.buttonProps;

  if (dayRender.isHidden) {
    return null;
  }

  if (!dayRender.isButton) {
    return (
      <div className="flex h-full min-h-[5rem] w-full flex-col items-start ">
        <div
          className={cn('px-3 pt-2 text-base font-bold', {
            'text-primary': today && !outside,
            'text-black': !isWeekend && !outside,
            'text-gray-600': outside,
          })}
        >
          {dayRender.divProps.children}
        </div>
      </div>
    );
  }
  return (
    <div
      className={cn('flex flex-col aspect-w-1 aspect-h-1', {
        'bg-green-100 text-primary': selected,
        'bg-gray-50': disabled,
        'bg-white': !disabled && !selected,
      })}
    >
      <div className="flex flex-col">
        <button
          ref={buttonRef}
          disabled={!!disabled}
          {...buttonProps}
          className="flex w-full flex-col items-start"
        >
          <div
            className={cn('px-3 pt-2 text-base font-bold', {
              'text-primary': today && !hidden,
              // 'text-black': !isWeekend && !hidden,
              'text-gray-600': hidden,
              'text-gray-800': disabled,
            })}
          >
            {dayRender.buttonProps.children}
          </div>
        </button>
        <div className="flex flex-col flex-1">
          {appointments.length !== 0 && (
            <>
              <ul className="flex-1 relative overflow-hidden">
                {appointments.slice(0, 2).map((appointment) => (
                  <li
                    key={appointment.id}
                    className="text-xs flex py-1 px-2 rounded text-left bg-primary-foreground w-full"
                  >
                    <span className="truncate text-center">
                      {format(appointment.schedule.start_time, 'HH:mm aa')} -{' '}
                      {format(appointment.schedule.end_time, 'HH:mm aa')}
                    </span>
                  </li>
                ))}
              </ul>
              {appointments.length > 2 && (
                <p className="text-xs">+ {appointments.length - 2} more</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
