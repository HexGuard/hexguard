import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { injectPagination } from '@hexguard/angular-pagination';

import { ANGULAR_PAGINATION_CROSS_STACK_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

interface PaginatedResponse {
  items: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  rangeStart: number;
  rangeEnd: number;
}

@Component({
  standalone: true,
  selector: 'demo-pagination-cross-stack-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  template: `
    <demo-page-layout testId="pagination-cross-stack-page">
      <demo-navigation-strip demoNavigation testId="pagination-cross-stack-nav" [demo]="demo" />

      <article demoIntro class="demo-card demo-card--stack">
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Cross-stack: Angular Pagination + .NET</p>
            <h2>URL-synced pagination calling the .NET SampleApi.</h2>
          </div>
        </div>
        <p class="demo-card__summary">
          <code>injectPagination()</code> provides client-side pagination state. The component
          fetches paginated product data from the <strong>HexGuard.Pagination</strong> .NET library
          via the shared SampleApi at <code>/api/pagination/products/raw</code>.
        </p>

        <div class="pag-cross-stack">
          <span class="demo-hint-pill">.NET: HexGuard.Pagination</span>
          <span>↔</span>
          <span class="demo-hint-pill">Angular: @hexguard/angular-pagination</span>
        </div>

        <demo-status-strip
          testId="pagination-cross-stack-status"
          summary="URL-synced pagination with .NET backend integration. Page state is reflected in the browser URL."
          currentUrl="Angular Pagination — Cross-stack Demo"
          summaryTestId="pagination-cross-stack-summary"
          urlTestId="pagination-cross-stack-url"
        />
      </article>

      <article demoPrimary class="demo-card demo-card--stack" data-testid="pagination-cross-stack">
        <div class="pag-toolbar">
          <label
            >Page size:
            <select
              [value]="pag.pageSize()"
              (change)="pag.setPageSize(+$any($event.target).value)"
              data-testid="pag-cs-page-size"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </label>
          <button (click)="fetchPage()" [disabled]="isBusy()" data-testid="pag-cs-fetch-btn">
            {{ isBusy() ? 'Loading…' : 'Fetch from .NET API' }}
          </button>
        </div>

        @if (error()) {
          <div class="demo-banner demo-banner--error" data-testid="pag-cs-error-banner">
            <strong>API Error:</strong> {{ error() }}<br />
            Make sure the SampleApi is running (<code>pnpm dotnet:start:demo-api</code>).
          </div>
        }

        @if (response(); as res) {
          <div class="pag-info">
            <span data-testid="pag-cs-range">
              Showing {{ res.rangeStart }}–{{ res.rangeEnd }} of {{ res.totalCount }}
            </span>
            <span>Page {{ res.page }} of {{ res.totalPages }}</span>
          </div>

          <div class="pag-nav-buttons">
            <button (click)="firstPage()" [disabled]="pag.isFirstPage()" data-testid="pag-cs-first">
              ««
            </button>
            <button (click)="prevPage()" [disabled]="pag.isFirstPage()" data-testid="pag-cs-prev">
              «
            </button>
            @for (p of pageRange(); track p) {
              <button
                (click)="goToPage(p)"
                [class.active]="p === pag.page()"
                [attr.data-testid]="'pag-cs-page-' + p"
              >
                {{ p }}
              </button>
            }
            <button (click)="nextPage()" [disabled]="pag.isLastPage()" data-testid="pag-cs-next">
              »
            </button>
            <button (click)="lastPage()" [disabled]="pag.isLastPage()" data-testid="pag-cs-last">
              »»
            </button>
          </div>

          <table class="pag-table" data-testid="pag-cs-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              @for (product of res.items; track product.id) {
                <tr>
                  <td class="pag-cell-id">{{ product.id }}</td>
                  <td>{{ product.name }}</td>
                  <td>{{ product.category }}</td>
                  <td>\${{ product.price.toFixed(2) }}</td>
                  <td>{{ product.stock }}</td>
                </tr>
              }
            </tbody>
          </table>
        } @else {
          <p class="pag-empty" data-testid="pag-cs-empty">
            Click "Fetch from .NET API" to load products.
          </p>
        }
      </article>

      <demo-inspector-panel
        demoAside
        panelTestId="pagination-cross-stack-inspector"
        eyebrow="Reference"
        title="URL-synced Pagination snapshot"
        summary="Angular pagination state synced to URL, backed by .NET API."
        [snapshotJson]="snapshotJson()"
        [snippetId]="demo.codeSample.snippetId"
        [docsLinks]="demo.docsLinks"
        snapshotTestId="pag-cs-snapshot-json"
        codeTestId="pag-cs-code-sample"
      />
    </demo-page-layout>
  `,
  styles: [
    `
      .pag-toolbar {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;
        margin-bottom: 0.75rem;
      }
      .pag-toolbar label {
        font-size: 0.875rem;
        display: flex;
        align-items: center;
        gap: 0.35rem;
      }
      .pag-toolbar select {
        padding: 0.3rem 0.5rem;
        border-radius: 0.35rem;
        border: 1px solid var(--color-border);
        font-size: 0.85rem;
      }
      .pag-toolbar button {
        padding: 0.5rem 1rem;
        border: 1px solid var(--color-border);
        border-radius: 0.35rem;
        background: var(--color-surface);
        cursor: pointer;
        font-size: 0.85rem;
      }
      .pag-toolbar button:hover {
        background: var(--color-surface-alt);
      }
      .pag-toolbar button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .pag-url-hint {
        font-size: 0.75rem;
        color: var(--color-text-weak);
        font-family: monospace;
        margin-left: auto;
      }
      .pag-cross-stack {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        justify-content: center;
        margin-top: 0.75rem;
      }
      .pag-info {
        display: flex;
        gap: 1rem;
        margin-bottom: 0.75rem;
        font-size: 0.875rem;
        color: var(--color-text-weak);
      }
      .pag-nav-buttons {
        display: flex;
        gap: 0.3rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
      }
      .pag-nav-buttons button {
        padding: 0.4rem 0.7rem;
        border: 1px solid var(--color-border);
        border-radius: 0.4rem;
        background: var(--color-surface);
        cursor: pointer;
      }
      .pag-nav-buttons button.active {
        background: #5bc0de;
        color: white;
        border-color: #5bc0de;
      }
      .pag-nav-buttons button:disabled {
        opacity: 0.4;
        cursor: default;
      }
      .pag-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;
      }
      .pag-table th,
      .pag-table td {
        padding: 0.5rem 0.75rem;
        text-align: left;
        border-bottom: 1px solid var(--color-border);
      }
      .pag-table th {
        font-weight: 600;
        background: var(--color-surface-alt);
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .pag-cell-id {
        font-family: monospace;
        font-size: 0.8rem;
      }
      .pag-empty {
        padding: 1.5rem;
        text-align: center;
        color: var(--color-text-weak);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationCrossStackDemoPageComponent {
  protected readonly demo = ANGULAR_PAGINATION_CROSS_STACK_DEMO;

  private readonly apiBase = 'http://127.0.0.1:5250';

  /** Pagination state managed by angular-pagination. */
  protected readonly pag = injectPagination({ pageSize: 10 });

  protected readonly response = signal<PaginatedResponse | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly isBusy = signal(false);

  protected readonly pageRange = computed(() => {
    const total = this.pag.totalPages();
    const current = this.pag.page();
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      page: this.pag.page(),
      pageSize: this.pag.pageSize(),
      total: this.pag.total(),
      totalPages: this.pag.totalPages(),
      hasNext: this.pag.hasNext(),
      hasPrevious: this.pag.hasPrevious(),
      rangeStart: this.pag.rangeStart(),
      rangeEnd: this.pag.rangeEnd(),
      isFirst: this.pag.isFirstPage(),
      isLast: this.pag.isLastPage(),
      response: this.response(),
    }),
  );

  async fetchPage(): Promise<void> {
    const url = `${this.apiBase}/api/pagination/products/raw?page=${this.pag.page()}&pageSize=${this.pag.pageSize()}`;
    this.isBusy.set(true);
    this.error.set(null);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const body: PaginatedResponse = await res.json();
      this.response.set(body);
      this.pag.total.set(body.totalCount);
    } catch (cause) {
      this.error.set(cause instanceof Error ? cause.message : String(cause));
      this.response.set(null);
    } finally {
      this.isBusy.set(false);
    }
  }

  goToPage(p: number): void {
    this.pag.goToPage(p);
    void this.fetchPage();
  }

  nextPage(): void {
    this.pag.nextPage();
    void this.fetchPage();
  }

  prevPage(): void {
    this.pag.previousPage();
    void this.fetchPage();
  }

  firstPage(): void {
    this.pag.firstPage();
    void this.fetchPage();
  }

  lastPage(): void {
    this.pag.lastPage();
    void this.fetchPage();
  }

  onPageSizeChange(size: number): void {
    this.pag.setPageSize(size);
    void this.fetchPage();
  }
}
