import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { injectPagination } from '@hexguard/angular-pagination';
import { ANGULAR_PAGINATION_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-pagination-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  template: `
    <demo-page-layout testId="pagination-demo-page">
      <demo-navigation-strip demoNavigation testId="pagination-demo-navigation" [demo]="demo" />

      <article demoIntro class="demo-card demo-card--stack">
        <div class="demo-card__header">
          <div><p class="demo-eyebrow">Angular Pagination</p><h2>Signal-based pagination state.</h2></div>
        </div>
        <p class="demo-card__summary">
          <code>injectPagination()</code> provides signal-based page, pageSize, total, totalPages,
          hasNext, hasPrevious, rangeStart, rangeEnd, and navigation helpers.
        </p>
        <demo-status-strip testId="pagination-demo-status" summary="Signal-based pagination state with page math and navigation."
          currentUrl="Angular Pagination — Demo" summaryTestId="pagination-demo-summary" urlTestId="pagination-demo-url" />
      </article>

      <article demoPrimary class="demo-card demo-card--stack" data-testid="pagination-playground">
        <div class="pagination-controls">
          <label class="pagination-label">Page size:
            <select [value]="pag.pageSize()" (change)="pag.setPageSize(+$any($event.target).value)" data-testid="pag-page-size">
              <option value="5">5</option><option value="10">10</option><option value="20">20</option>
            </select>
          </label>
          <label class="pagination-label">Total items:
            <input type="number" [value]="pag.total()" (input)="pag.total.set(+$any($event.target).value)" data-testid="pag-total" />
          </label>
        </div>

        <div class="pagination-info">
          <span data-testid="pag-range">Showing {{pag.rangeStart()}}–{{pag.rangeEnd()}} of {{pag.total()}}</span>
          <span data-testid="pag-page">Page {{pag.page()}} of {{pag.totalPages()}}</span>
        </div>

        <div class="pagination-nav">
          <button (click)="pag.firstPage()" [disabled]="pag.isFirstPage()" data-testid="pag-first">««</button>
          <button (click)="pag.previousPage()" [disabled]="pag.isFirstPage()" data-testid="pag-prev">«</button>
          @for (p of pageRange(); track p) {
            <button (click)="pag.goToPage(p)" [class.active]="p === pag.page()" [attr.data-testid]="'pag-page-' + p">{{p}}</button>
          }
          <button (click)="pag.nextPage()" [disabled]="pag.isLastPage()" data-testid="pag-next">»</button>
          <button (click)="pag.lastPage()" [disabled]="pag.isLastPage()" data-testid="pag-last">»»</button>
        </div>

        <div class="pagination-signals">
          <div class="pagination-signal"><span>page</span><span data-testid="pag-sig-page">{{pag.page()}}</span></div>
          <div class="pagination-signal"><span>totalPages</span><span data-testid="pag-sig-total-pages">{{pag.totalPages()}}</span></div>
          <div class="pagination-signal"><span>hasNext</span><span data-testid="pag-sig-has-next">{{pag.hasNext()}}</span></div>
          <div class="pagination-signal"><span>hasPrevious</span><span data-testid="pag-sig-has-prev">{{pag.hasPrevious()}}</span></div>
          <div class="pagination-signal"><span>isFirstPage</span><span data-testid="pag-sig-first">{{pag.isFirstPage()}}</span></div>
          <div class="pagination-signal"><span>isLastPage</span><span data-testid="pag-sig-last">{{pag.isLastPage()}}</span></div>
        </div>
      </article>

      <demo-inspector-panel demoAside panelTestId="pagination-inspector-panel" eyebrow="Reference"
        title="Pagination snapshot" summary="Live pagination state."
        [snapshotJson]="snapshotJson()" [snippetId]="demo.codeSample.snippetId"
        [docsLinks]="demo.docsLinks" snapshotTestId="pagination-snapshot-json" codeTestId="pagination-code-sample" />
    </demo-page-layout>
  `,
  styles: [`
    .pagination-controls { display: flex; gap: 1rem; margin-bottom: 1rem; }
    .pagination-label { font-size: 0.9rem; display: flex; align-items: center; gap: 0.4rem; }
    .pagination-label select, .pagination-label input { padding: 0.3rem 0.5rem; border-radius: 0.4rem; border: 1px solid var(--color-border); }
    .pagination-info { display: flex; gap: 1rem; margin-bottom: 0.75rem; font-size: 0.9rem; color: var(--color-text-weak); }
    .pagination-nav { display: flex; gap: 0.3rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .pagination-nav button { padding: 0.4rem 0.7rem; border: 1px solid var(--color-border); border-radius: 0.4rem; background: var(--color-surface); cursor: pointer; }
    .pagination-nav button.active { background: #5bc0de; color: white; border-color: #5bc0de; }
    .pagination-nav button:disabled { opacity: 0.4; cursor: default; }
    .pagination-signals { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(10rem,100%),1fr)); gap: 0.4rem; }
    .pagination-signal { display: flex; justify-content: space-between; padding: 0.4rem 0.6rem; border-radius: 0.4rem; border: 1px solid var(--color-border); font-family: monospace; font-size: 0.85rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationDemoPageComponent {
  protected readonly demo = ANGULAR_PAGINATION_DEMO;
  protected readonly pag = injectPagination({ pageSize: 10 });
  protected readonly pageRange = computed(() => {
    const total = this.pag.totalPages();
    const current = this.pag.page();
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });
  protected readonly snapshotJson = computed(() => formatSnapshot({
    page: this.pag.page(), pageSize: this.pag.pageSize(), total: this.pag.total(),
    totalPages: this.pag.totalPages(), hasNext: this.pag.hasNext(), hasPrevious: this.pag.hasPrevious(),
    rangeStart: this.pag.rangeStart(), rangeEnd: this.pag.rangeEnd(),
  }));
}
