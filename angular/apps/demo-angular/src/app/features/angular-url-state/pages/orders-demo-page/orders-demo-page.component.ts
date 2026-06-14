import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  arrayParam,
  enumParam,
  numberParam,
  stringParam,
  urlState,
} from '@hexguard/angular-url-state';

import { ANGULAR_URL_STATE_ORDERS_DEMO } from '../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../shared/components/demo-status-strip.component';
import { createTrackedCurrentUrl } from '../../../../shared/current-url.signal';
import { formatSnapshot } from '../../../../shared/formatting';
import {
  ORDER_RECORDS,
  PAGE_SIZE_OPTIONS,
  STATUS_OPTIONS,
  formatCurrency,
  normalizeTags,
  type OrderRecord,
} from '../../data/orders.fixture';

@Component({
  standalone: true,
  selector: 'demo-orders-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    FormsModule,
  ],
  templateUrl: './orders-demo-page.component.html',
  styleUrl: './orders-demo-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersDemoPageComponent {
  readonly demo = ANGULAR_URL_STATE_ORDERS_DEMO;
  readonly statusOptions = STATUS_OPTIONS;
  readonly pageSizeOptions = PAGE_SIZE_OPTIONS;
  readonly currency = formatCurrency;

  // demo-snippet:start orders-demo-state
  readonly state = urlState(
    {
      searchText: { codec: stringParam(''), queryKey: 'q' },
      pageNumber: { codec: numberParam(1), queryKey: 'p' },
      pageSize: { codec: numberParam(5), queryKey: 'size' },
      statusFilter: { codec: enumParam(STATUS_OPTIONS, 'open'), queryKey: 'status' },
      selectedTags: { codec: arrayParam(stringParam()), queryKey: 'tag' },
    },
    {
      debounceMs: 250,
      history: 'replace',
      removeDefaultsFromUrl: true,
    },
  );
  readonly currentUrl = createTrackedCurrentUrl(this.demo.route);
  readonly filteredOrders = computed<readonly OrderRecord[]>(() => {
    const search = this.state.searchText().trim().toLowerCase();
    const activeStatus = this.state.statusFilter();
    const activeTags = this.state.selectedTags();

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
  readonly totalResults = computed(() => this.filteredOrders().length);
  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalResults() / Math.max(this.state.pageSize(), 1))),
  );
  readonly currentPage = computed(() => Math.min(this.state.pageNumber(), this.totalPages()));
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
  readonly tagValue = computed(() => this.state.selectedTags().join(', '));
  readonly snapshotJson = computed(() => formatSnapshot(this.state.snapshot()));
  // demo-snippet:end orders-demo-state

  updateSearch(value: string): void {
    this.state.patch({ searchText: value.trimStart(), pageNumber: 1 });
  }

  updateStatus(value: (typeof STATUS_OPTIONS)[number]): void {
    this.state.patch({ statusFilter: value, pageNumber: 1 });
  }

  updatePageSize(value: string): void {
    this.state.patch({ pageSize: Number(value), pageNumber: 1 });
  }

  updatePageNumber(value: string): void {
    this.goToPage(Number(value));
  }

  updateTags(value: string): void {
    this.state.patch({ selectedTags: normalizeTags(value), pageNumber: 1 });
  }

  goToPage(page: number): void {
    const nextPage = Math.max(1, Math.min(page, this.totalPages()));
    this.state.pageNumber.set(nextPage);
  }

  resetFilters(): void {
    this.state.reset();
  }
}
