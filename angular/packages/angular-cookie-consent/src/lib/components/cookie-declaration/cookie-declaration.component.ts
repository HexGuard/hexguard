import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';

/** A single entry in the cookie declaration table. */
export interface CookieDeclarationEntry {
  readonly name: string;
  readonly domain: string;
  readonly party: 'first' | 'third';
  readonly purpose: string;
  readonly category: string;
  readonly duration: string;
  readonly type: 'cookie' | 'localstorage' | 'indexeddb' | 'other';
  readonly provider?: string;
  readonly description?: string;
}

/**
 * Auto-generated cookie declaration table.
 * Displays a sortable, filterable list of cookies and storage items.
 *
 * @example
 * ```html
 * <hex-cookie-declaration
 *   [cookies]="cookieEntries"
 *   [filterable]="true"
 * />
 * ```
 */
@Component({
  standalone: true,
  selector: 'hex-cookie-declaration',
  template: `
    <div class="hex-cookie-declaration" data-testid="cookie-declaration">
      @if (filterable()) {
        <div class="hex-cookie-declaration__toolbar">
          <select
            class="hex-cookie-declaration__filter"
            (change)="onCategoryFilter($event)"
            data-testid="cookie-declaration-filter"
          >
            <option value="">All categories</option>
            @for (cat of categories(); track cat) {
              <option value="{{cat}}">{{cat}}</option>
            }
          </select>
        </div>
      }

      <div class="hex-cookie-declaration__table-wrapper">
        <table class="hex-cookie-declaration__table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Domain</th>
              <th>Party</th>
              <th>Purpose</th>
              <th>Category</th>
              <th>Duration</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            @for (entry of filteredEntries(); track entry.name + entry.domain) {
              <tr>
                <td>{{ entry.name }}</td>
                <td>{{ entry.domain }}</td>
                <td>{{ entry.party }}</td>
                <td>{{ entry.purpose }}</td>
                <td>
                  <span class="hex-cookie-declaration__category-tag">{{ entry.category }}</span>
                </td>
                <td>{{ entry.duration }}</td>
                <td>{{ entry.type }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      @if (filteredEntries().length === 0) {
        <p class="hex-cookie-declaration__empty">No cookies match the selected filter.</p>
      }
    </div>
  `,
  styles: [`
    .hex-cookie-declaration {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      color: var(--hex-consent-banner-text, #1a1a1a);
    }
    .hex-cookie-declaration__toolbar {
      margin-bottom: 12px;
    }
    .hex-cookie-declaration__filter {
      padding: 6px 12px;
      border: 1px solid var(--hex-consent-banner-border, #ddd);
      border-radius: 4px;
      font-size: 13px;
      background: #fff;
    }
    .hex-cookie-declaration__table-wrapper {
      overflow-x: auto;
    }
    .hex-cookie-declaration__table {
      width: 100%;
      border-collapse: collapse;
    }
    .hex-cookie-declaration__table th {
      text-align: left;
      padding: 8px 12px;
      border-bottom: 2px solid var(--hex-consent-banner-border, #e0e0e0);
      font-weight: 600;
      white-space: nowrap;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #666;
    }
    .hex-cookie-declaration__table td {
      padding: 8px 12px;
      border-bottom: 1px solid #f0f0f0;
    }
    .hex-cookie-declaration__table tbody tr:hover {
      background: #fafafa;
    }
    .hex-cookie-declaration__category-tag {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 500;
      background: #eef2ff;
      color: #4f46e5;
    }
    .hex-cookie-declaration__empty {
      text-align: center;
      padding: 24px;
      color: #999;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookieDeclarationComponent {
  readonly cookies = input<CookieDeclarationEntry[]>([]);
  readonly filterable = input(true);

  private readonly activeFilter = signal('');

  readonly categories = computed(() => {
    const seen = new Set<string>();
    for (const c of this.cookies()) {
      if (c.category) seen.add(c.category);
    }
    return Array.from(seen);
  });

  readonly filteredEntries = computed(() => {
    const filter = this.activeFilter();
    const all = this.cookies();
    if (!filter) return all;
    return all.filter(c => c.category === filter);
  });

  onCategoryFilter(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.activeFilter.set(value);
  }
}
