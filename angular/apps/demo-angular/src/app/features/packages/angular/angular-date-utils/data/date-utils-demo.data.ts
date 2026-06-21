export const DATE_UTILS_DEMO_EXAMPLES = {
  pastDate: new Date(Date.now() - 2 * 86_400_000 - 4 * 3_600_000),
  futureDate: new Date(Date.now() + 5 * 86_400_000),
  birthDate: new Date('1992-06-17'),
  startDate: new Date('2026-06-01'),
  endDate: new Date('2026-06-30'),
} as const;
