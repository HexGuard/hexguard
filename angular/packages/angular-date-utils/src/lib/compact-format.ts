import type { Duration } from './types';

/**
 * Compact date formatting. Omits year when the date falls in the current year.
 * @example compactDate(new Date('2026-06-17')) // "Jun 17"
 * @example compactDate(new Date('2025-06-17')) // "Jun 17, 2025"
 */
export function compactDate(date: Date, locale = 'en-US'): string {
  const now = new Date();
  const sameYear = date.getFullYear() === now.getFullYear();

  if (sameYear) {
    return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
  }
  return date.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Compact date + time formatting.
 * @example compactDateTime(new Date()) // "Jun 17, 3:45 PM"
 */
export function compactDateTime(date: Date, locale = 'en-US'): string {
  const now = new Date();
  const sameYear = date.getFullYear() === now.getFullYear();

  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Formats a Duration object as a compact string.
 * @example formatDuration({ days: 5, hours: 3, minutes: 0, seconds: 0 }) // "5d 3h"
 */
export function formatDuration(duration: Duration): string {
  const parts: string[] = [];
  if (duration.days > 0) parts.push(`${duration.days}d`);
  if (duration.hours > 0) parts.push(`${duration.hours}h`);
  if (duration.minutes > 0 && parts.length < 2) parts.push(`${duration.minutes}m`);
  if (duration.seconds > 0 && parts.length === 0) parts.push(`${duration.seconds}s`);
  return parts.join(' ') || '0s';
}

/**
 * Calculates age in full years from a birth date.
 * @example ageInYears(new Date('1992-06-17')) // 34
 */
export function ageInYears(birthDate: Date): number {
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
