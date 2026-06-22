import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DemoInspectorPanelComponent } from '../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../shared/components/demo-page-layout.component';
import { formatSnapshot } from '../../../../../shared/formatting';
import { createTrackedCurrentUrl } from '../../../../../shared/current-url.signal';
import { DOTNET_PAGINATION_HOME } from '../../../../../demo-registry';
import { getDotnetPackage } from '../../../../../demo-registry';
import type { DemoPageEntry } from '../../../../../demo-registry';

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
  selector: 'demo-dotnet-pagination-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
  ],
  template: `
    <demo-page-layout testId="dotnet-pagination-page">
      <demo-navigation-strip
        demoNavigation
        [demo]="dummyDemoEntry"
        [dotnetDemo]="demo"
        [dotnetPackage]="DOTNET_PAGINATION_PACKAGE"
        testId="dotnet-pagination-nav"
      />

      <article demoIntro class="demo-card demo-card--stack">
        <div class="demo-eyebrow">HexGuard.Pagination</div>
        <h2>Paginated product list via the shared .NET SampleApi</h2>
        <p class="demo-card__summary">
          Fetch pages of products from the <strong>HexGuard.Pagination</strong>
          library running in the shared SampleApi. The <code>/api/pagination/products/raw</code>
          endpoint returns typed paginated responses.
        </p>

        <div class="pag-cross-stack">
          <span class="demo-hint-pill">.NET: HexGuard.Pagination</span>
          <span>↔</span>
          <span class="demo-hint-pill">Angular: @hexguard/angular-pagination</span>
        </div>
      </article>

      <article demoPrimary class="demo-card demo-card--stack">
        <div class="pag-toolbar">
          <label>Page:
            <input type="number" [value]="page()" min="1" [max]="response()?.totalPages ?? 1"
              (input)="goToPage(+($any($event.target).value))" data-testid="pag-page-input" />
          </label>
          <label>Page size:
            <select [value]="pageSize()" (change)="changePageSize(+($any($event.target).value))" data-testid="pag-page-size-select">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </label>
          <button (click)="fetchPage()" [disabled]="isBusy()" data-testid="pag-fetch-btn">
            {{ isBusy() ? 'Loading…' : 'Fetch from API' }}
          </button>
        </div>

        @if (error()) {
          <div class="demo-banner demo-banner--error" data-testid="pag-error-banner">
            <strong>API Error:</strong> {{ error() }}<br />
            Make sure the SampleApi is running (<code>pnpm dotnet:start:demo-api</code>).
          </div>
        }

        @if (response(); as res) {
          <div class="pag-info">
            <span data-testid="pag-range">
              Showing {{ res.rangeStart }}–{{ res.rangeEnd }} of {{ res.totalCount }}
            </span>
            <span>Page {{ res.page }} of {{ res.totalPages }}</span>
            @if (res.hasNext) { <span class="pag-hint">→ has next</span> }
            @if (res.hasPrevious) { <span class="pag-hint">← has previous</span> }
          </div>

          <table class="pag-table" data-testid="pag-products-table">
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
                  <td>{{ product.id }}</td>
                  <td>{{ product.name }}</td>
                  <td>{{ product.category }}</td>
                  <td>\${{ product.price.toFixed(2) }}</td>
                  <td>{{ product.stock }}</td>
                </tr>
              }
            </tbody>
          </table>
        } @else {
          <p class="pag-empty" data-testid="pag-empty">Click "Fetch from API" to load products.</p>
        }
      </article>

      <demo-inspector-panel demoAside panelTestId="dotnet-pagination-inspector" eyebrow="Reference"
        title="Pagination snapshot" summary="Live pagination state from the .NET SampleApi."
        [snapshotJson]="snapshotJson()" snippetId=""
        snapshotTestId="dotnet-pagination-snapshot" codeTestId="dotnet-pagination-code" />
    </demo-page-layout>
  `,
  styles: [`
    .pag-toolbar { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.75rem; }
    .pag-toolbar label { font-size: 0.875rem; display: flex; align-items: center; gap: 0.35rem; }
    .pag-toolbar input, .pag-toolbar select { padding: 0.3rem 0.5rem; border-radius: 0.35rem; border: 1px solid var(--color-border); font-size: 0.85rem; width: 5rem; }
    .pag-toolbar button { padding: 0.5rem 1rem; border: 1px solid var(--color-border); border-radius: 0.35rem; background: var(--color-surface); cursor: pointer; font-size: 0.85rem; }
    .pag-toolbar button:hover { background: var(--color-surface-alt); }
    .pag-toolbar button:disabled { opacity: 0.5; cursor: not-allowed; }
    .pag-cross-stack { display: flex; align-items: center; gap: 0.5rem; justify-content: center; margin-top: 0.75rem; }
    .pag-info { display: flex; gap: 1rem; margin-bottom: 0.75rem; font-size: 0.875rem; color: var(--color-text-weak); align-items: center; }
    .pag-hint { font-style: italic; color: var(--color-accent); }
    .pag-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
    .pag-table th, .pag-table td { padding: 0.5rem 0.75rem; text-align: left; border-bottom: 1px solid var(--color-border); }
    .pag-table th { font-weight: 600; background: var(--color-surface-alt); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; }
    .pag-table td:first-child { font-family: monospace; font-size: 0.8rem; }
    .pag-empty { padding: 1.5rem; text-align: center; color: var(--color-text-weak); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DotnetPaginationDemoPageComponent {
  readonly demo = DOTNET_PAGINATION_HOME;
  readonly DOTNET_PAGINATION_PACKAGE = getDotnetPackage('hexguard-pagination');

  readonly dummyDemoEntry: DemoPageEntry = {
    id: 'hexguard-pagination',
    packageId: 'hexguard-pagination',
    route: '/dotnet/pagination',
    legacyRoute: '',
    label: 'Pagination Library',
    title: this.demo.title,
    description: this.demo.description,
    docsLinks: this.demo.docsLinks,
    codeSample: { snippetId: '', label: '', description: '' },
  };

  readonly currentUrl = createTrackedCurrentUrl(this.demo.route);

  private readonly apiBase = 'http://127.0.0.1:5250';

  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly response = signal<PaginatedResponse | null>(null);
  readonly error = signal<string | null>(null);
  readonly isBusy = signal(false);

  readonly snapshotJson = computed(() =>
    formatSnapshot({
      page: this.page(),
      pageSize: this.pageSize(),
      response: this.response(),
      error: this.error(),
      isBusy: this.isBusy(),
    }),
  );

  goToPage(p: number): void {
    if (p >= 1) this.page.set(p);
  }

  changePageSize(size: number): void {
    this.pageSize.set(size);
    this.page.set(1);
  }

  async fetchPage(): Promise<void> {
    const url = `${this.apiBase}/api/pagination/products/raw?page=${this.page()}&pageSize=${this.pageSize()}`;
    this.isBusy.set(true);
    this.error.set(null);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const body: PaginatedResponse = await res.json();
      this.response.set(body);
    } catch (cause) {
      this.error.set(cause instanceof Error ? cause.message : String(cause));
      this.response.set(null);
    } finally {
      this.isBusy.set(false);
    }
  }
}
