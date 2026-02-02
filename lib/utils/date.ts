import { formatDistanceToNow, format } from 'date-fns';

/**
 * Format a date to a user-friendly relative time string
 */
export function formatRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Format a date to a standard date string
 */
export function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy');
}

/**
 * Format a date to include time
 */
export function formatDateTime(date: Date): string {
  return format(date, 'MMM d, yyyy HH:mm');
}
