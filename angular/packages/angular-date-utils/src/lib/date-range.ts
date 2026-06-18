/**
 * Immutable date range model with validation, containment, overlap, and preset factories.
 *
 * The `DateRange` class is a plain TypeScript class — no DI needed, usable anywhere.
 *
 * @example
 * ```ts
 * const range = new DateRange(new Date('2026-06-01'), new Date('2026-06-30'));
 * range.isValid;   // true
 * range.contains(new Date('2026-06-15')); // true
 * ```
 */
export class DateRange {
  constructor(
    /** Inclusive start date. */
    readonly start: Date,
    /** Inclusive end date. */
    readonly end: Date,
  ) {}

  /** Whether the range is valid (end >= start). */
  get isValid(): boolean {
    return this.end.getTime() >= this.start.getTime();
  }

  /** Duration in whole days. */
  get durationDays(): number {
    return Math.max(
      0,
      Math.round((this.end.getTime() - this.start.getTime()) / (1000 * 60 * 60 * 24)),
    );
  }

  /** Whether the given date falls within this range (inclusive). */
  contains(date: Date): boolean {
    const t = date.getTime();
    return t >= this.start.getTime() && t <= this.end.getTime();
  }

  /** Whether this range overlaps with another range. */
  overlaps(other: DateRange): boolean {
    return (
      this.start.getTime() <= other.end.getTime() && this.end.getTime() >= other.start.getTime()
    );
  }

  // ── Preset factories ─────────────────────────────────────────

  /** Rolling 7-day window ending today (inclusive). */
  static last7Days(): DateRange {
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    return new DateRange(start, end);
  }

  /** Rolling 30-day window ending today (inclusive). */
  static last30Days(): DateRange {
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - 29);
    return new DateRange(start, end);
  }

  /** The current calendar month. */
  static thisMonth(): DateRange {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return new DateRange(start, end);
  }

  /** The previous calendar month. */
  static lastMonth(): DateRange {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    return new DateRange(start, end);
  }

  /** Rolling 30-day window starting today (inclusive). */
  static next30Days(): DateRange {
    const start = new Date();
    const end = new Date(start);
    end.setDate(end.getDate() + 29);
    return new DateRange(start, end);
  }

  /** Creates a custom range from the given start and end dates. */
  static custom(start: Date, end: Date): DateRange {
    return new DateRange(start, end);
  }
}
