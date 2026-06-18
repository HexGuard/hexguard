import type { Duration } from './types';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Computes the breakdown of days, hours, minutes, and seconds between two dates.
 * The result is always positive (absolute difference).
 * @example durationBetween(new Date('2026-06-10'), new Date('2026-06-17')) // { days: 7, hours: 0, minutes: 0, seconds: 0 }
 */
export function durationBetween(start: Date, end: Date): Duration {
  const ms = Math.abs(end.getTime() - start.getTime());

  return {
    days: Math.floor(ms / DAY),
    hours: Math.floor((ms % DAY) / HOUR),
    minutes: Math.floor((ms % HOUR) / MINUTE),
    seconds: Math.floor((ms % MINUTE) / SECOND),
  };
}
