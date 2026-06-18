import { TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';

import { relativeTime, shortRelativeTime, exactRelativeTime } from './relative-time';
import { compactDate, compactDateTime, formatDuration, ageInYears } from './compact-format';
import { isWeekend, addBusinessDays, businessDaysBetween } from './business-days';
import { durationBetween } from './duration';
import { DateRange } from './date-range';
import { injectDateUtils } from './date-utils';
import type { Duration } from './types';

describe('relativeTime', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns "just now" for differences under 10 seconds', () => {
    const now = new Date();
    expect(relativeTime(new Date(now.getTime() - 5_000))).toBe('just now');
    expect(relativeTime(new Date(now.getTime() + 5_000))).toBe('just now');
  });

  it('formats past dates', () => {
    const now = Date.now();
    vi.setSystemTime(now);

    const twoDaysAgo = new Date(now - 2 * 86_400_000);
    expect(relativeTime(twoDaysAgo)).toBe('2 days ago');
  });

  it('formats future dates', () => {
    const now = Date.now();
    vi.setSystemTime(now);

    const threeDaysFromNow = new Date(now + 3 * 86_400_000);
    expect(relativeTime(threeDaysFromNow)).toBe('in 3 days');
  });

  it('formats hours', () => {
    const now = Date.now();
    vi.setSystemTime(now);

    const fiveHoursAgo = new Date(now - 5 * 3_600_000);
    expect(relativeTime(fiveHoursAgo)).toBe('5 hours ago');
  });

  it('respects locale parameter', () => {
    const now = Date.now();
    vi.setSystemTime(now);

    const twoDaysAgo = new Date(now - 2 * 86_400_000);
    const result = relativeTime(twoDaysAgo, 'fr-FR');
    // French formatting may differ, but should not throw and should return a string
    expect(result).toBeTypeOf('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('shortRelativeTime', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns "now" for differences under 10 seconds', () => {
    const now = new Date();
    expect(shortRelativeTime(new Date(now.getTime() - 5_000))).toBe('now');
  });

  it('formats in compact notation', () => {
    const now = Date.now();
    vi.setSystemTime(now);

    const fiveMinAgo = new Date(now - 5 * 60_000);
    expect(shortRelativeTime(fiveMinAgo)).toBe('5m ago');
  });
});

describe('exactRelativeTime', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns "just now" for differences under 10 seconds', () => {
    expect(exactRelativeTime(new Date())).toBe('just now');
  });

  it('formats with two units of precision', () => {
    const now = Date.now();
    vi.setSystemTime(now);

    const past = new Date(now - 2 * 86_400_000 - 4 * 3_600_000);
    expect(exactRelativeTime(past)).toBe('2 days, 4 hours ago');
  });

  it('formats future dates', () => {
    const now = Date.now();
    vi.setSystemTime(now);

    const future = new Date(now + 2 * 86_400_000 + 2 * 3_600_000);
    expect(exactRelativeTime(future)).toBe('in 2 days, 2 hours');
  });

  it('falls back to "just now" when no units qualify', () => {
    const now = new Date();
    const fiveSecAgo = new Date(now.getTime() - 5_000);
    expect(exactRelativeTime(fiveSecAgo)).toBe('just now');
  });
});

describe('compactDate', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('omits year for dates in the current year', () => {
    vi.setSystemTime(new Date('2026-06-18'));
    const date = new Date('2026-03-15');
    expect(compactDate(date)).toBe('Mar 15');
  });

  it('includes year for dates in a different year', () => {
    vi.setSystemTime(new Date('2026-06-18'));
    const date = new Date('2025-12-25');
    expect(compactDate(date)).toBe('Dec 25, 2025');
  });
});

describe('compactDateTime', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('omits year for dates in the current year', () => {
    vi.setSystemTime(new Date('2026-06-18'));
    const date = new Date('2026-03-15T14:30:00');
    const result = compactDateTime(date);
    expect(result).toMatch(/Mar 15,? 2:30 PM/);
    expect(result).not.toContain('2026');
  });

  it('includes year for dates in a different year', () => {
    vi.setSystemTime(new Date('2026-06-18'));
    const date = new Date('2025-06-15T09:00:00');
    const result = compactDateTime(date);
    expect(result).toContain('2025');
  });
});

describe('formatDuration', () => {
  it('formats days and hours', () => {
    const d: Duration = { days: 5, hours: 3, minutes: 0, seconds: 0 };
    expect(formatDuration(d)).toBe('5d 3h');
  });

  it('formats hours and minutes (max 2 parts)', () => {
    const d: Duration = { days: 0, hours: 4, minutes: 30, seconds: 0 };
    expect(formatDuration(d)).toBe('4h 30m');
  });

  it('formats seconds only when no larger units', () => {
    const d: Duration = { days: 0, hours: 0, minutes: 0, seconds: 45 };
    expect(formatDuration(d)).toBe('45s');
  });

  it('returns "0s" for zero duration', () => {
    const d: Duration = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    expect(formatDuration(d)).toBe('0s');
  });

  it('shows minutes alongside days', () => {
    const d: Duration = { days: 1, hours: 0, minutes: 30, seconds: 0 };
    expect(formatDuration(d)).toBe('1d 30m');
  });
});

describe('ageInYears', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('calculates age correctly', () => {
    vi.setSystemTime(new Date('2026-06-18'));
    expect(ageInYears(new Date('1992-06-17'))).toBe(34);
  });

  it('subtracts year when birthday has not occurred yet this year', () => {
    vi.setSystemTime(new Date('2026-06-18'));
    expect(ageInYears(new Date('1992-06-20'))).toBe(33);
  });

  it('handles birthday on the current day', () => {
    vi.setSystemTime(new Date('2026-06-18'));
    const today = new Date('1992-06-18');
    expect(ageInYears(today)).toBe(34);
  });

  it('returns 0 for newborn', () => {
    vi.setSystemTime(new Date('2026-06-18'));
    const newborn = new Date('2026-06-18');
    expect(ageInYears(newborn)).toBe(0);
  });
});

describe('isWeekend', () => {
  it('returns true for Saturday', () => {
    expect(isWeekend(new Date('2026-06-20'))).toBe(true); // Saturday
  });

  it('returns true for Sunday', () => {
    expect(isWeekend(new Date('2026-06-21'))).toBe(true); // Sunday
  });

  it('returns false for Monday', () => {
    expect(isWeekend(new Date('2026-06-22'))).toBe(false); // Monday
  });

  it('returns false for Wednesday', () => {
    expect(isWeekend(new Date('2026-06-17'))).toBe(false); // Wednesday
  });
});

describe('addBusinessDays', () => {
  it('adds business days forward, skipping weekends', () => {
    // Wednesday June 17 + 3 business days = Monday June 22
    const start = new Date('2026-06-17');
    const result = addBusinessDays(start, 3);
    expect(result.toISOString().slice(0, 10)).toBe('2026-06-22');
  });

  it('handles negative days (backwards)', () => {
    // Monday June 22 - 3 business days = Wednesday June 17
    const start = new Date('2026-06-22');
    const result = addBusinessDays(start, -3);
    expect(result.toISOString().slice(0, 10)).toBe('2026-06-17');
  });

  it('returns same date when days is 0', () => {
    const start = new Date('2026-06-17');
    const result = addBusinessDays(start, 0);
    expect(result.toISOString().slice(0, 10)).toBe('2026-06-17');
  });

  it('does not modify the original date', () => {
    const start = new Date('2026-06-17');
    const copy = new Date(start);
    addBusinessDays(start, 3);
    expect(start.getTime()).toBe(copy.getTime());
  });
});

describe('businessDaysBetween', () => {
  it('counts weekdays between two dates', () => {
    // Mon Jun 15 to Mon Jun 22 -> 5 business days
    const start = new Date('2026-06-15');
    const end = new Date('2026-06-22');
    expect(businessDaysBetween(start, end)).toBe(5);
  });

  it('returns 0 for same day', () => {
    const start = new Date('2026-06-17');
    expect(businessDaysBetween(start, start)).toBe(0);
  });

  it('handles a range crossing weekends', () => {
    // Wed Jun 17 to Wed Jun 24 -> 5 business days (skips Sat/Sun)
    const start = new Date('2026-06-17');
    const end = new Date('2026-06-24');
    expect(businessDaysBetween(start, end)).toBe(5);
  });
});

describe('durationBetween', () => {
  it('computes duration between two dates', () => {
    const result = durationBetween(new Date('2026-06-10'), new Date('2026-06-17'));
    expect(result).toEqual({ days: 7, hours: 0, minutes: 0, seconds: 0 });
  });

  it('computes mixed duration', () => {
    const result = durationBetween(
      new Date('2026-06-17T10:30:00'),
      new Date('2026-06-18T14:45:30'),
    );
    expect(result).toEqual({ days: 1, hours: 4, minutes: 15, seconds: 30 });
  });

  it('returns absolute value (order independent)', () => {
    const a = new Date('2026-06-17');
    const b = new Date('2026-06-10');
    expect(durationBetween(a, b)).toEqual(durationBetween(b, a));
  });
});

describe('DateRange', () => {
  it('isValid returns true for valid range', () => {
    const range = new DateRange(new Date('2026-06-01'), new Date('2026-06-30'));
    expect(range.isValid).toBe(true);
  });

  it('isValid returns false for reversed range', () => {
    const range = new DateRange(new Date('2026-06-30'), new Date('2026-06-01'));
    expect(range.isValid).toBe(false);
  });

  it('isValid returns true for single-day range', () => {
    const range = new DateRange(new Date('2026-06-17'), new Date('2026-06-17'));
    expect(range.isValid).toBe(true);
  });

  it('contains returns true for date within range', () => {
    const range = new DateRange(new Date('2026-06-01'), new Date('2026-06-30'));
    expect(range.contains(new Date('2026-06-15'))).toBe(true);
  });

  it('contains returns false for date outside range', () => {
    const range = new DateRange(new Date('2026-06-01'), new Date('2026-06-30'));
    expect(range.contains(new Date('2026-07-01'))).toBe(false);
  });

  it('contains is inclusive of start and end', () => {
    const range = new DateRange(new Date('2026-06-01'), new Date('2026-06-30'));
    expect(range.contains(new Date('2026-06-01'))).toBe(true);
    expect(range.contains(new Date('2026-06-30'))).toBe(true);
  });

  it('overlaps returns true for overlapping ranges', () => {
    const a = new DateRange(new Date('2026-06-01'), new Date('2026-06-30'));
    const b = new DateRange(new Date('2026-06-15'), new Date('2026-07-15'));
    expect(a.overlaps(b)).toBe(true);
    expect(b.overlaps(a)).toBe(true);
  });

  it('overlaps returns false for non-overlapping ranges', () => {
    const a = new DateRange(new Date('2026-06-01'), new Date('2026-06-10'));
    const b = new DateRange(new Date('2026-06-15'), new Date('2026-06-30'));
    expect(a.overlaps(b)).toBe(false);
  });

  it('overlaps returns true for touching ranges (inclusive)', () => {
    const a = new DateRange(new Date('2026-06-01'), new Date('2026-06-15'));
    const b = new DateRange(new Date('2026-06-15'), new Date('2026-06-30'));
    expect(a.overlaps(b)).toBe(true);
  });

  it('durationDays returns whole days', () => {
    const range = new DateRange(new Date('2026-06-01'), new Date('2026-06-30'));
    expect(range.durationDays).toBe(29);
  });

  it('last7Days creates a 7-day window', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-18'));
    const range = DateRange.last7Days();
    expect(range.start.toISOString().slice(0, 10)).toBe('2026-06-12');
    expect(range.end.toISOString().slice(0, 10)).toBe('2026-06-18');
    vi.useRealTimers();
  });

  it('thisMonth covers the current calendar month', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-18'));
    const range = DateRange.thisMonth();
    expect(range.start.getFullYear()).toBe(2026);
    expect(range.start.getMonth()).toBe(5); // June
    expect(range.start.getDate()).toBe(1);
    expect(range.end.getMonth()).toBe(5);
    expect(range.end.getDate()).toBe(30);
    vi.useRealTimers();
  });

  it('lastMonth covers the previous calendar month', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-18'));
    const range = DateRange.lastMonth();
    expect(range.start.getFullYear()).toBe(2026);
    expect(range.start.getMonth()).toBe(4); // May
    expect(range.start.getDate()).toBe(1);
    expect(range.end.getMonth()).toBe(4);
    expect(range.end.getDate()).toBe(31);
    vi.useRealTimers();
  });

  it('next30Days creates a 30-day window from today', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-18'));
    const range = DateRange.next30Days();
    expect(range.start.toISOString().slice(0, 10)).toBe('2026-06-18');
    expect(range.end.toISOString().slice(0, 10)).toBe('2026-07-17');
    vi.useRealTimers();
  });
});

describe('injectDateUtils', () => {
  it('returns a facade with all date utility methods', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
    });

    const utils = TestBed.runInInjectionContext(() => injectDateUtils());
    expect(utils.locale).toBe('fr-FR');
    expect(typeof utils.relativeTime).toBe('function');
    expect(typeof utils.shortRelativeTime).toBe('function');
    expect(typeof utils.exactRelativeTime).toBe('function');
    expect(typeof utils.compactDate).toBe('function');
    expect(typeof utils.compactDateTime).toBe('function');
    expect(typeof utils.durationBetween).toBe('function');
    expect(typeof utils.formatDuration).toBe('function');
    expect(typeof utils.ageInYears).toBe('function');
    expect(typeof utils.isWeekend).toBe('function');
    expect(typeof utils.addBusinessDays).toBe('function');
    expect(typeof utils.businessDaysBetween).toBe('function');
    expect(utils.DateRange).toBe(DateRange);
  });

  it('uses provided locale option over LOCALE_ID', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
    });

    const utils = TestBed.runInInjectionContext(() => injectDateUtils({ locale: 'de-DE' }));
    expect(utils.locale).toBe('de-DE');
  });
});
