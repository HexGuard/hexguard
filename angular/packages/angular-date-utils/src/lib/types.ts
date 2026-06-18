/** Duration breakdown between two dates. */
export interface Duration {
  readonly days: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
}

/** Options for {@link injectDateUtils}. */
export interface DateUtilsOptions {
  /** Locale identifier used for formatting. Defaults to Angular's LOCALE_ID or browser default. */
  readonly locale?: string;
}
