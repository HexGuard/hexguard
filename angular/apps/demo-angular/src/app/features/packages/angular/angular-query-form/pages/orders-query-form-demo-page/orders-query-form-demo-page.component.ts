import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import {
  arrayParam,
  enumParam,
  numberParam,
  queryForm,
  stringParam,
} from '@hexguard/angular-query-form';

import { ANGULAR_QUERY_FORM_ORDERS_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { createTrackedCurrentUrl } from '../../../../../../shared/current-url.signal';
import { formatSnapshot } from '../../../../../../shared/formatting';
import {
  QUERY_FORM_ORDER_RECORDS,
  QUERY_FORM_ORDER_STATUS_OPTIONS,
  QUERY_FORM_PAGE_SIZE_OPTIONS,
  QUERY_FORM_TAG_OPTIONS,
  formatQueryFormCurrency,
  toggleQueryFormTag,
  type QueryFormOrderRecord,
} from '../../data/orders-query-form.data';

type OrdersQueryForm = FormGroup<{
  search: FormControl<string>;
  status: FormControl<(typeof QUERY_FORM_ORDER_STATUS_OPTIONS)[number]>;
  tags: FormControl<string[]>;
}>;

@Component({
  standalone: true,
  selector: 'demo-orders-query-form-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './orders-query-form-demo-page.component.html',
  styleUrl: './orders-query-form-demo-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersQueryFormDemoPageComponent {
  readonly demo = ANGULAR_QUERY_FORM_ORDERS_DEMO;
  readonly statusOptions = QUERY_FORM_ORDER_STATUS_OPTIONS;
  readonly pageSizeOptions = QUERY_FORM_PAGE_SIZE_OPTIONS;
  readonly tagOptions = QUERY_FORM_TAG_OPTIONS;
  readonly currency = formatQueryFormCurrency;

  // demo-snippet:start query-form-orders-demo
  readonly form: OrdersQueryForm = new FormGroup({
    search: new FormControl('', { nonNullable: true }),
    status: new FormControl<(typeof QUERY_FORM_ORDER_STATUS_OPTIONS)[number]>('open', {
      nonNullable: true,
    }),
    tags: new FormControl<string[]>([], { nonNullable: true }),
  });
  readonly query = queryForm(
    this.form,
    {
      search: stringParam(''),
      page: numberParam(1),
      pageSize: numberParam(5),
      status: enumParam(QUERY_FORM_ORDER_STATUS_OPTIONS, 'open'),
      tags: arrayParam(stringParam()),
    },
    {
      managedKeys: ['search', 'status', 'tags'] as const,
      syncMode: 'manual',
      debounceMs: 250,
      history: 'replace',
      removeDefaultsFromUrl: true,
      resetKeysOnChange: {
        search: ['page'],
        status: ['page'],
        tags: ['page'],
      },
    },
  );
  readonly currentUrl = createTrackedCurrentUrl(this.demo.route);
  readonly filteredOrders = computed<readonly QueryFormOrderRecord[]>(() => {
    const snapshot = this.query.snapshot();
    const search = snapshot.search.trim().toLowerCase();

    return QUERY_FORM_ORDER_RECORDS.filter((record) => {
      const matchesSearch =
        search.length === 0 ||
        [record.id, record.customer, record.region].some((value) =>
          value.toLowerCase().includes(search),
        );
      const matchesStatus = record.status === snapshot.status;
      const matchesTags = snapshot.tags.every((tag) => record.tags.includes(tag));

      return matchesSearch && matchesStatus && matchesTags;
    });
  });
  readonly totalResults = computed(() => this.filteredOrders().length);
  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalResults() / Math.max(this.query.urlState.pageSize(), 1))),
  );
  readonly currentPage = computed(() => Math.min(this.query.urlState.page(), this.totalPages()));
  readonly pagedOrders = computed(() => {
    const pageSize = Math.max(this.query.urlState.pageSize(), 1);
    const pageIndex = this.currentPage() - 1;
    const start = pageIndex * pageSize;

    return this.filteredOrders().slice(start, start + pageSize);
  });
  readonly resultSummary = computed(() => {
    const total = this.totalResults();

    if (total === 0) {
      return 'No orders match the current query-form state.';
    }

    const start = (this.currentPage() - 1) * this.query.urlState.pageSize() + 1;
    const end = Math.min(start + this.pagedOrders().length - 1, total);

    return `Showing ${start}-${end} of ${total} matching orders.`;
  });
  readonly stagingSummary = computed(() =>
    this.query.hasPendingChanges()
      ? 'Draft filter changes are staged locally. Apply to update the URL and result set.'
      : 'Results, URL, and staged filters are aligned.',
  );
  readonly snapshotJson = computed(() => formatSnapshot(this.query.snapshot()));
  // demo-snippet:end query-form-orders-demo

  toggleTag(tag: string): void {
    const currentTags = this.form.controls.tags.value;

    this.form.controls.tags.setValue(toggleQueryFormTag(currentTags, tag, this.tagOptions));
  }

  applyFilters(): void {
    this.query.commit();
  }

  discardDraft(): void {
    this.query.revert();
  }

  setPageFromInput(rawValue: string): void {
    const parsedPage = Number.parseInt(rawValue, 10);

    this.goToPage(Number.isFinite(parsedPage) ? parsedPage : 1);
  }

  setPageSizeFromInput(rawValue: string): void {
    const parsedPageSize = Number.parseInt(rawValue, 10);
    const nextPageSize = this.pageSizeOptions.find((size) => size === parsedPageSize) ?? 5;

    this.query.patch({
      page: 1,
      pageSize: nextPageSize,
    });
  }

  goToPage(page: number): void {
    const nextPage = Math.max(1, Math.min(page, this.totalPages()));

    this.query.patch({ page: nextPage });
  }

  resetFilters(): void {
    this.query.reset();
  }
}
