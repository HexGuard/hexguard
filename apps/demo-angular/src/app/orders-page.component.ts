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

import {
  arrayParam,
  enumParam,
  numberParam,
  stringParam,
  urlState,
} from '@hexguard/angular-url-state';

type OrderStatus = 'open' | 'closed' | 'archived';

interface OrderRecord {
  readonly id: string;
  readonly customer: string;
  readonly region: string;
  readonly status: OrderStatus;
  readonly total: number;
  readonly tags: readonly string[];
  readonly ageDays: number;
}

const STATUS_OPTIONS = ['open', 'closed', 'archived'] as const;
const PAGE_SIZE_OPTIONS = [5, 10, 25, 50] as const;
const USD_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const ORDER_RECORDS: readonly OrderRecord[] = [
  {
    id: 'HG-1042',
    customer: 'Northwind',
    region: 'Berlin',
    status: 'open',
    total: 18420,
    tags: ['priority', 'b2b'],
    ageDays: 2,
  },
  {
    id: 'HG-1045',
    customer: 'Summit Health',
    region: 'Austin',
    status: 'open',
    total: 8120,
    tags: ['renewal'],
    ageDays: 1,
  },
  {
    id: 'HG-1049',
    customer: 'Aster Labs',
    region: 'London',
    status: 'open',
    total: 23100,
    tags: ['priority', 'expansion'],
    ageDays: 4,
  },
  {
    id: 'HG-1053',
    customer: 'Pine Valley',
    region: 'Toronto',
    status: 'closed',
    total: 5540,
    tags: ['b2c'],
    ageDays: 8,
  },
  {
    id: 'HG-1055',
    customer: 'Bluebird Freight',
    region: 'Oslo',
    status: 'archived',
    total: 16490,
    tags: ['legacy'],
    ageDays: 27,
  },
  {
    id: 'HG-1057',
    customer: 'Cedar Systems',
    region: 'Melbourne',
    status: 'closed',
    total: 11230,
    tags: ['renewal', 'apac'],
    ageDays: 6,
  },
  {
    id: 'HG-1060',
    customer: 'Orbit Retail',
    region: 'Chicago',
    status: 'open',
    total: 9720,
    tags: ['retail'],
    ageDays: 3,
  },
  {
    id: 'HG-1064',
    customer: 'Sora Travel',
    region: 'Tokyo',
    status: 'open',
    total: 14580,
    tags: ['apac', 'priority'],
    ageDays: 5,
  },
  {
    id: 'HG-1068',
    customer: 'Lighthouse Media',
    region: 'Dublin',
    status: 'closed',
    total: 6320,
    tags: ['retainer'],
    ageDays: 11,
  },
  {
    id: 'HG-1071',
    customer: 'Kepler Mobility',
    region: 'Seattle',
    status: 'archived',
    total: 20540,
    tags: ['fleet'],
    ageDays: 38,
  },
  {
    id: 'HG-1076',
    customer: 'Verde Foods',
    region: 'Lisbon',
    status: 'open',
    total: 7280,
    tags: ['retail', 'europe'],
    ageDays: 2,
  },
  {
    id: 'HG-1080',
    customer: 'Atlas Capital',
    region: 'New York',
    status: 'open',
    total: 18990,
    tags: ['priority', 'enterprise'],
    ageDays: 7,
  },
] as const;

function normalizeTags(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(',')
        .map((item) => item.trim().toLowerCase())
        .filter((item) => item.length > 0),
    ),
  );
}

function formatCurrency(value: number): string {
  return USD_FORMATTER.format(value);
}

function stringifySnapshot(value: unknown): string {
  return JSON.stringify(
    value,
    (_key, entry) => (entry instanceof Date ? entry.toISOString() : entry),
    2,
  );
}

@Component({
  standalone: true,
  selector: 'demo-orders-page',
  imports: [FormsModule],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPageComponent {
  private readonly location = inject(Location);
  private readonly destroyRef = inject(DestroyRef);

  readonly statusOptions = STATUS_OPTIONS;
  readonly pageSizeOptions = PAGE_SIZE_OPTIONS;
  readonly currency = formatCurrency;
  readonly state = urlState(
    {
      search: stringParam(''),
      page: numberParam(1),
      pageSize: numberParam(5),
      status: enumParam(STATUS_OPTIONS, 'open'),
      tags: arrayParam(stringParam()),
    },
    {
      debounceMs: 250,
      history: 'replace',
      removeDefaultsFromUrl: true,
    },
  );
  readonly currentUrl = signal(this.location.path() || '/orders');
  readonly totalResults = computed(() => this.filteredOrders().length);
  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalResults() / Math.max(this.state.pageSize(), 1))),
  );
  readonly currentPage = computed(() => Math.min(this.state.page(), this.totalPages()));
  readonly filteredOrders = computed(() => {
    const search = this.state.search().trim().toLowerCase();
    const activeStatus = this.state.status();
    const activeTags = this.state.tags();

    return ORDER_RECORDS.filter((record) => {
      const matchesSearch =
        search.length === 0 ||
        [record.id, record.customer, record.region].some((value) =>
          value.toLowerCase().includes(search),
        );
      const matchesStatus = record.status === activeStatus;
      const matchesTags = activeTags.every((tag) => record.tags.includes(tag));

      return matchesSearch && matchesStatus && matchesTags;
    });
  });
  readonly pagedOrders = computed(() => {
    const pageSize = Math.max(this.state.pageSize(), 1);
    const pageIndex = this.currentPage() - 1;
    const start = pageIndex * pageSize;

    return this.filteredOrders().slice(start, start + pageSize);
  });
  readonly resultSummary = computed(() => {
    const total = this.totalResults();

    if (total === 0) {
      return 'No orders match the current URL state.';
    }

    const start = (this.currentPage() - 1) * this.state.pageSize() + 1;
    const end = Math.min(start + this.pagedOrders().length - 1, total);

    return `Showing ${start}-${end} of ${total} matching orders.`;
  });
  readonly tagValue = computed(() => this.state.tags().join(', '));
  readonly snapshotJson = computed(() => stringifySnapshot(this.state.snapshot()));

  constructor() {
    const stopTrackingUrl = this.location.onUrlChange((url) => {
      this.currentUrl.set(url || '/orders');
    });

    this.destroyRef.onDestroy(stopTrackingUrl);
  }

  updateSearch(value: string): void {
    this.state.patch({ search: value.trimStart(), page: 1 });
  }

  updateStatus(value: OrderStatus): void {
    this.state.patch({ status: value, page: 1 });
  }

  updatePageSize(value: string): void {
    this.state.patch({ pageSize: Number(value), page: 1 });
  }

  updatePageNumber(value: string): void {
    this.goToPage(Number(value));
  }

  updateTags(value: string): void {
    this.state.patch({ tags: normalizeTags(value), page: 1 });
  }

  goToPage(page: number): void {
    const nextPage = Math.max(1, Math.min(page, this.totalPages()));
    this.state.page.set(nextPage);
  }

  resetFilters(): void {
    this.state.reset();
  }
}
