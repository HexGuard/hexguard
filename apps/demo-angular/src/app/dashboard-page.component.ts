import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { booleanParam, dateIsoParam, enumParam, urlState } from '@hexguard/angular-url-state';

type DashboardTab = 'overview' | 'fulfillment' | 'revenue';

interface MetricCard {
  readonly label: string;
  readonly value: string;
  readonly detail: string;
}

const TAB_OPTIONS = ['overview', 'fulfillment', 'revenue'] as const;

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function parseDateInput(value: string): Date | null {
  return value ? new Date(`${value}T00:00:00.000Z`) : null;
}

function formatDateInput(value: Date | null): string {
  return value === null ? '' : value.toISOString().slice(0, 10);
}

function formatSnapshot(value: unknown): string {
  return JSON.stringify(
    value,
    (_key, entry) => (entry instanceof Date ? entry.toISOString() : entry),
    2,
  );
}

@Component({
  standalone: true,
  selector: 'demo-dashboard-page',
  imports: [FormsModule],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  private readonly location = inject(Location);
  private readonly destroyRef = inject(DestroyRef);

  readonly tabs = TAB_OPTIONS;
  readonly state = urlState(
    {
      startDate: dateIsoParam(),
      endDate: dateIsoParam(),
      showArchived: booleanParam(false),
      tab: enumParam(TAB_OPTIONS, 'overview'),
    },
    {
      history: 'push',
      removeDefaultsFromUrl: true,
    },
  );
  readonly currentUrl = signal(this.location.path() || '/dashboard');
  readonly startDateValue = computed(() => formatDateInput(this.state.startDate()));
  readonly endDateValue = computed(() => formatDateInput(this.state.endDate()));
  readonly snapshotJson = computed(() => formatSnapshot(this.state.snapshot()));
  readonly rangeLabel = computed(() => {
    const start = this.startDateValue();
    const end = this.endDateValue();

    if (!start && !end) {
      return 'All time';
    }

    return `${start || '...'} to ${end || '...'}`;
  });
  readonly metrics = computed<readonly MetricCard[]>(() => {
    const archivedMultiplier = this.state.showArchived() ? 1.08 : 1;
    const rangeBias = this.state.startDate() && this.state.endDate() ? 1.12 : 1;

    switch (this.state.tab()) {
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
  });

  constructor() {
    const stopTrackingUrl = this.location.onUrlChange((url) => {
      this.currentUrl.set(url || '/dashboard');
    });

    this.destroyRef.onDestroy(stopTrackingUrl);
  }

  selectTab(tab: DashboardTab): void {
    this.state.tab.set(tab);
  }

  updateStartDate(value: string): void {
    this.state.startDate.set(parseDateInput(value));
  }

  updateEndDate(value: string): void {
    this.state.endDate.set(parseDateInput(value));
  }

  toggleArchived(value: boolean): void {
    this.state.showArchived.set(value);
  }

  applyPreset(days: number): void {
    const end = startOfUtcDay(new Date());
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - (days - 1));

    this.state.patch({
      startDate: start,
      endDate: end,
    });
  }

  clearRange(): void {
    this.state.patch({ startDate: null, endDate: null });
  }
}
