import { type ClassValue, clsx } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export const priceFormatter = () => {
  return Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  });
};

const defaultDateToken = 'MMM dd, yyyy';
export const formatDate = (date: Date, formatToken?: string) => {
  return format(date, formatToken ?? defaultDateToken);
};

const defaultTimeToken = 'hh:mm aa';
export const formatTime = (date: Date, formatToken?: string) => {
  return format(date, formatToken ?? defaultTimeToken);
};

export const formatDateTime = (date: Date, formatToken?: string) => {
  return format(date, formatToken ?? `${defaultDateToken} ${defaultTimeToken}`);
};

export const toPayloadDate = (date: Date) => format(date, 'yyyy-MM-dd');
export const toPayloadTimeFormat = (
  date: Date,
  options?: { includeSeconds: boolean },
) => format(date, options?.includeSeconds ? 'HH:mm:ss' : 'HH:mm');

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function removeEmptyProperties(obj: { [k: string]: any }): {
  [k: string]: any;
} {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null && v !== ''),
  );
}
