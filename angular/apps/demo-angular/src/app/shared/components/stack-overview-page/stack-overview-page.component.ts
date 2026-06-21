import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PackageCardComponent } from '../package-card/package-card.component';
import { StackHubLayoutComponent } from '../stack-hub-layout/stack-hub-layout.component';
import {
  getUnifiedPackages,
  STACK_REGISTRY,
  STACK_ORDER,
  SITE_SHARED_API_CONSUMERS,
  SECTION_COLLAPSED_LIMIT,
  type StackId,
  type UnifiedPackageEntry,
} from '../../../site-catalog';
import {
  PACKAGE_CATEGORIES,
  groupPackagesByCategory,
  getCategoryLabel,
  getCategoryDescription,
  sortCategoryEntries,
} from '../../package-categories';

@Component({
  selector: 'demo-stack-overview-page',
  standalone: true,
  imports: [PackageCardComponent, RouterLink, StackHubLayoutComponent],
  template: `
    <demo-stack-hub-layout [testId]="testId()">
      <div heroContent>
        <p class="demo-eyebrow">{{ stackDef().label }} packages</p>
        <h2>{{ heroTitle() }}</h2>
        <p class="demo-card__summary stack-overview__lede">{{ stackDef().description }}</p>
        <div class="demo-link-row">
          @for (link of siblingLinks(); track link.route) {
            <a class="stack-overview__action" [routerLink]="link.route">{{ link.label }}</a>
          }
        </div>
      </div>

      <div sections class="section-stack">
        <section class="stack-overview__section" aria-labelledby="packages-heading">
          <div class="stack-overview__section-heading">
            <div>
              <p class="demo-eyebrow">{{ stackDef().label }} packages</p>
              <h2 id="packages-heading">
                {{ packages().length }} {{ stackDef().label }} package{{
                  packages().length !== 1 ? 's' : ''
                }}
              </h2>
            </div>
            <p class="demo-card__summary">
              Each card links to a dedicated package hub with docs, source, and demo routes.
            </p>
          </div>

          <!-- Category filter chips (Angular stack only) -->
          @if (stackId() === 'angular' && categories().length > 0) {
            <div class="stack-category-filter" role="group" aria-label="Filter by category">
              <button
                type="button"
                class="stack-category-chip"
                [class.stack-category-chip--active]="activeCategory() === null"
                (click)="activeCategory.set(null)"
                [attr.data-testid]="testId() + '-category-all'"
              >
                All
              </button>
              @for (cat of categories(); track cat) {
                <button
                  type="button"
                  class="stack-category-chip"
                  [class.stack-category-chip--active]="activeCategory() === cat"
                  (click)="activeCategory.set(cat)"
                  [attr.data-testid]="
                    testId() + '-category-' + cat.replace(/\\s+/g, '-').toLowerCase()
                  "
                >
                  {{ getCategoryLabel(cat) }}
                </button>
              }
            </div>
          }

          <!-- Category-grouped sections when showing all -->
          @if (activeCategory() === null && stackId() === 'angular') {
            @for (entry of categoryGroups(); track entry[0]) {
              <div class="stack-category-section">
                <div class="stack-category-header">
                  <p class="demo-eyebrow">{{ getCategoryLabel(entry[0]) }}</p>
                  @if (getCategoryDescription(entry[0]); as desc) {
                    <p class="demo-card__summary">{{ desc }}</p>
                  }
                </div>
                <div class="stack-overview__grid">
                  @for (pkg of entry[1]; track pkg.id) {
                    <demo-package-card [entry]="pkg" />
                  }
                </div>
              </div>
            }
          } @else {
            <!-- Flat grid when filtered by category or non-Angular stack -->
            <div class="stack-overview__grid">
              @for (entry of displayed(); track entry.id) {
                <demo-package-card [entry]="entry" />
              }
            </div>

            @if (packages().length > sectionCollapsedLimit) {
              <button
                class="stack-overview__expand-toggle"
                type="button"
                (click)="showAll.set(!showAll())"
                [attr.data-testid]="testId() + '-expand-toggle'"
              >
                {{
                  showAll()
                    ? 'Show fewer packages'
                    : 'Show all ' + packages().length + ' ' + stackDef().label + ' packages'
                }}
              </button>
            }
          }
        </section>

        <!-- Cross-stack specific: shared API consumers -->
        @if (stackId() === 'cross-stack' && sharedApiConsumers.length > 0) {
          <section class="stack-overview__section" aria-labelledby="consumers-heading">
            <div class="demo-card demo-card--stack stack-overview__consumers-card">
              <p class="demo-eyebrow">Shared API consumers</p>
              <h2 id="consumers-heading">Angular packages that consume the .NET SampleApi</h2>
              <p class="demo-card__summary">
                These Angular packages connect to the .NET SampleApi for live HTTP demos. Start the
                API with <code>pnpm dotnet:start:demo-api</code> to enable backend integration.
              </p>
              <div class="demo-link-row">
                @for (consumer of sharedApiConsumers; track consumer.angularId) {
                  <a class="demo-link-chip" [routerLink]="'/packages/' + consumer.angularId">
                    {{ consumer.angularLabel }}
                  </a>
                }
                <a class="demo-link-chip" routerLink="/dotnet/sample-api">SampleApi Explorer</a>
              </div>
            </div>
          </section>
        }
      </div>
    </demo-stack-hub-layout>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .stack-overview__lede {
        max-width: 52rem;
      }
      .stack-overview__action {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 2.4rem;
        padding: 0.6rem 0.95rem;
        border: 1px solid rgba(13, 73, 82, 0.24);
        border-radius: 0.7rem;
        background: linear-gradient(180deg, #155e68, #0d4952);
        color: white;
        font-weight: 600;
        font-size: 0.82rem;
        text-decoration: none;
        box-shadow: var(--shadow-soft);
        transition:
          transform 180ms ease,
          box-shadow 180ms ease,
          background 180ms ease;
      }
      .stack-overview__action:hover,
      .stack-overview__action:focus-visible {
        transform: translateY(-1px);
        box-shadow: var(--shadow-medium);
        background: linear-gradient(180deg, #176d76, #0f525a);
      }
      .stack-overview__section {
        display: grid;
        gap: var(--space-grid);
      }
      .stack-overview__section-heading {
        display: flex;
        gap: 0.75rem;
        align-items: end;
        justify-content: space-between;
        flex-wrap: wrap;
      }
      .stack-overview__section-heading h2 {
        margin: 0;
        color: var(--color-ink);
        font-size: clamp(1.25rem, 2vw, 1.65rem);
        line-height: 1.05;
        letter-spacing: -0.04em;
      }
      .stack-overview__section-heading p {
        max-width: 42rem;
      }
      .stack-overview__grid {
        display: grid;
        gap: var(--space-grid);
        grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr));
      }
      .stack-overview__expand-toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        justify-self: start;
        min-height: 2.2rem;
        padding: 0.4rem 0.85rem;
        border: 1px solid var(--color-accent-border);
        border-radius: var(--radius-pill);
        background: var(--color-surface-strong);
        color: var(--color-accent-strong);
        font-family: var(--font-mono);
        font-size: 0.78rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        cursor: pointer;
        box-shadow: var(--surface-glow), var(--shadow-soft);
        transition:
          transform 150ms ease,
          border-color 150ms ease,
          box-shadow 150ms ease;
      }
      .stack-overview__expand-toggle:hover,
      .stack-overview__expand-toggle:focus-visible {
        transform: translateY(-1px);
        border-color: var(--color-accent-border-strong);
        box-shadow: var(--surface-glow), var(--shadow-medium);
      }
      .stack-overview__consumers-card {
        background: rgba(248, 252, 251, 0.72);
        border-color: rgba(13, 73, 82, 0.14);
      }

      /* Category filter bar */
      .stack-category-filter {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        padding: 0.75rem 0;
      }
      .stack-category-chip {
        display: inline-flex;
        align-items: center;
        min-height: 2rem;
        padding: 0.3rem 0.75rem;
        border: 1px solid var(--color-accent-border);
        border-radius: var(--radius-pill);
        background: var(--color-surface);
        color: var(--color-accent-strong);
        font-family: var(--font-mono);
        font-size: 0.78rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        cursor: pointer;
        transition:
          transform 150ms ease,
          border-color 150ms ease,
          background 150ms ease,
          box-shadow 150ms ease;
      }
      .stack-category-chip:hover,
      .stack-category-chip:focus-visible {
        transform: translateY(-1px);
        border-color: var(--color-accent-border-strong);
        background: var(--color-surface-strong);
        box-shadow: var(--shadow-soft);
      }
      .stack-category-chip--active {
        background: var(--color-accent-strong);
        color: white;
        border-color: var(--color-accent-strong);
      }
      .stack-category-chip--active:hover {
        background: var(--color-accent-strong);
        border-color: var(--color-accent-strong);
      }

      /* Category section groups */
      .stack-category-section {
        display: grid;
        gap: 0.75rem;
        padding-top: 0.5rem;
      }
      .stack-category-header {
        display: grid;
        gap: 0.25rem;
      }
      .stack-category-header .demo-eyebrow {
        margin: 0;
        font-size: 1rem;
      }
      .stack-category-header .demo-card__summary {
        margin: 0;
        max-width: 42rem;
      }

      @media (max-width: 720px) {
        .stack-overview__expand-toggle {
          width: 100%;
          justify-self: stretch;
        }
        .stack-category-filter {
          gap: 0.4rem;
        }
        .stack-category-chip {
          font-size: 0.72rem;
          padding: 0.25rem 0.6rem;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackOverviewPageComponent {
  readonly stackId = input.required<StackId>();
  readonly testId = input.required<string>();
  readonly sectionCollapsedLimit = SECTION_COLLAPSED_LIMIT;
  readonly showAll = signal(false);
  readonly activeCategory = signal<string | null>(null);
  readonly sharedApiConsumers = SITE_SHARED_API_CONSUMERS;
  readonly allPackages = getUnifiedPackages();

  protected readonly getCategoryLabel = getCategoryLabel;
  protected readonly getCategoryDescription = getCategoryDescription;

  protected readonly stackDef = () => STACK_REGISTRY[this.stackId()];

  protected readonly heroTitle = () => {
    if (this.stackId() === 'angular') {
      return 'Angular guardrail libraries with live demos';
    }
    if (this.stackId() === 'dotnet') {
      return '.NET guardrail libraries and shared demo API';
    }
    return 'Angular + .NET integration pairs';
  };

  protected readonly packages = () => this.allPackages.filter((p) => p.scope === this.stackId());

  /** Unique category IDs present in the current stack's packages. */
  protected readonly categories = computed(() => {
    const pkgs = this.packages();
    const cats = new Set<string>();
    for (const p of pkgs) {
      if (p.category) cats.add(p.category);
    }
    // Return in canonical order
    return PACKAGE_CATEGORIES.map((c) => c.id).filter((id) => cats.has(id));
  });

  /** Packages grouped by category (only used when activeCategory is null). */
  protected readonly categoryGroups = computed(() => {
    const filtered = this.packages();
    const groups = groupPackagesByCategory(filtered);
    return sortCategoryEntries([...groups.entries()]);
  });

  /** Links to all OTHER stacks for cross-navigation. */
  protected readonly siblingLinks = () =>
    STACK_ORDER.filter((id) => id !== this.stackId() && id !== 'cross-stack').map((id) => ({
      route: STACK_REGISTRY[id].hubRoute,
      label: `Explore ${STACK_REGISTRY[id].label} packages`,
    }));

  /** Filtered packages (by active category if set, or all). */
  protected readonly displayed = (): readonly UnifiedPackageEntry[] => {
    let filtered = this.packages();

    if (this.activeCategory() !== null) {
      filtered = filtered.filter((p) => p.category === this.activeCategory());
    }

    return this.showAll() ? filtered : filtered.slice(0, this.sectionCollapsedLimit);
  };
}
