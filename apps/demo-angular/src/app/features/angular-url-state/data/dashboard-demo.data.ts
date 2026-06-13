export type DashboardTab = 'overview' | 'fulfillment' | 'revenue';

export interface MetricCard {
  readonly label: string;
  readonly value: string;
  readonly detail: string;
}

export const TAB_OPTIONS = ['overview', 'fulfillment', 'revenue'] as const;

export function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function parseDateInput(value: string): Date | null {
  return value ? new Date(`${value}T00:00:00.000Z`) : null;
}

export function formatDateInput(value: Date | null): string {
  return value === null ? '' : value.toISOString().slice(0, 10);
}

export function createMetrics(
  tab: DashboardTab,
  startDate: Date | null,
  endDate: Date | null,
  showArchived: boolean,
): readonly MetricCard[] {
  const archivedMultiplier = showArchived ? 1.08 : 1;
  const rangeBias = startDate && endDate ? 1.12 : 1;

  switch (tab) {
    case 'fulfillment':
      return [
        {
          label: 'Ready to ship',
          value: `${Math.round(184 * archivedMultiplier)}`,
          detail: 'Queue depth stays in the URL for ops handoffs.',
        },
        {
          label: 'SLA confidence',
          value: `${Math.round(94 * rangeBias)}%`,
          detail: 'Back and forward replays every filter decision.',
        },
        {
          label: 'Carrier exceptions',
          value: `${Math.round(11 * archivedMultiplier)}`,
          detail: 'Archived work can be toggled into the same shareable view.',
        },
      ];
    case 'revenue':
      return [
        {
          label: 'Projected ARR',
          value: `$${(2.84 * archivedMultiplier * rangeBias).toFixed(2)}M`,
          detail: 'Date ranges and tabs can be sent as a URL, not prose.',
        },
        {
          label: 'Expansion pipeline',
          value: `$${(612 * rangeBias).toFixed(0)}k`,
          detail: 'Useful for dashboards embedded inside admin flows.',
        },
        {
          label: 'At-risk renewals',
          value: `${Math.round(19 * archivedMultiplier)}`,
          detail: 'Push history keeps browser navigation intuitive.',
        },
      ];
    default:
      return [
        {
          label: 'Tracked workspaces',
          value: `${Math.round(428 * archivedMultiplier)}`,
          detail: 'A compact default state stays out of the URL until needed.',
        },
        {
          label: 'Active investigations',
          value: `${Math.round(63 * rangeBias)}`,
          detail: 'External URL edits feed back into Angular signals.',
        },
        {
          label: 'Weekly health score',
          value: `${Math.round(91 * archivedMultiplier)} / 100`,
          detail: 'Signal-first state keeps the UI deterministic and testable.',
        },
      ];
  }
}
