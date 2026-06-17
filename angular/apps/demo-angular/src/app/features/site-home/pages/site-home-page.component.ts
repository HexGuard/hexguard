import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PackageCardComponent } from '../../../shared/components/package-card/package-card.component';
import {
  getUnifiedPackages,
  SITE_METRICS,
  SITE_PILLARS,
  SITE_PRIMARY_ACTIONS,
  SITE_ROADMAP_PACKAGES,
  SITE_SHARED_API_CONSUMERS,
  SECTION_COLLAPSED_LIMIT,
  type UnifiedScope,
} from '../../../site-catalog';

@Component({
  standalone: true,
  selector: 'demo-site-home-page',
  imports: [PackageCardComponent, RouterLink],
  template: `
    <section class="site-home" data-testid="site-home-page">
      <!-- Hero -->
      <article class="site-home__hero demo-card demo-card--stack">
        <div class="site-home__hero-copy">
          <p class="demo-eyebrow">Open-source guardrails</p>
          <h2>Angular and .NET guardrails with live demos, docs, and a shared sample API.</h2>
          <p class="demo-card__summary site-home__lede">
            HexGuard is a monorepo for small, explicit application guardrails. The current public
            surface includes Angular packages and .NET libraries with live demos, a shared sample
            API that proves cross-stack integration, and a roadmap of planned packages.
          </p>

          <div class="site-home__actions">
            @for (action of actions; track action.href) {
              <a class="site-home__action" [href]="action.href" target="_blank" rel="noreferrer">
                {{ action.label }}
              </a>
            }
          </div>
        </div>
      </article>

      <!-- Metrics bar -->
      <dl class="site-home__metrics-bar" aria-label="Repository metrics">
        @for (metric of metrics; track metric.label) {
          <div class="site-home__metric">
            <dt>{{ metric.label }}</dt>
            <dd>{{ metric.value }}</dd>
          </div>
        }
      </dl>

      <!-- Unified package showcase -->
      <section class="site-home__section" aria-labelledby="showcase-heading">
        <div class="site-home__section-heading">
          <div>
            <p class="demo-eyebrow">Package showcase</p>
            <h2 id="showcase-heading">All packages across stacks</h2>
          </div>
          <p class="demo-card__summary">
            Angular packages, .NET libraries, and cross-stack pairs in one unified view.
          </p>
        </div>

        <!-- Filter chips -->
        <div class="site-home__filter-bar">
          @for (filter of filterOptions; track filter.scope) {
            <button
              type="button"
              class="site-home__filter-chip"
              [class.site-home__filter-chip--active]="activeFilter() === filter.scope"
              (click)="activeFilter.set(filter.scope)"
              [attr.data-testid]="'showcase-filter-' + filter.scope"
            >
              {{ filter.label }}
            </button>
          }
        </div>

        <div class="site-home__package-grid">
          @for (
            entry of filteredPackages();
            track entry.id
          ) {
            <demo-package-card [entry]="entry" />
          }
        </div>

        @if (filteredPackages().length > sectionCollapsedLimit) {
          <button
            class="site-home__expand-toggle"
            type="button"
            (click)="showAll.set(!showAll())"
            [attr.data-testid]="'showcase-expand-toggle'"
          >
            {{
              showAll()
                ? 'Show fewer packages'
                : 'Show all ' + filteredPackages().length + ' packages'
            }}
          </button>
        }

        <!-- Shared API consumers -->
        @if (sharedApiConsumers.length > 0) {
          <div class="demo-card demo-card--stack site-home__shared-api-card">
            <p class="demo-eyebrow">Shared API consumers</p>
            <p class="demo-card__summary">
              These Angular packages connect to the .NET SampleApi for live HTTP demos. Start the
              API with <code>pnpm dotnet:start:demo-api</code> to enable backend integration.
            </p>
            <div class="demo-link-row">
              @for (consumer of sharedApiConsumers; track consumer.angularId) {
                <a class="demo-link-chip" [routerLink]="'/packages/' + consumer.angularId">{{
                  consumer.angularLabel
                }}</a>
              }
              <a class="demo-link-chip" routerLink="/dotnet/sample-api">SampleApi Explorer</a>
            </div>
          </div>
        }
      </section>

      <!-- Design goals -->
      <section class="site-home__section" aria-labelledby="pillars-heading">
        <div class="site-home__section-heading">
          <div>
            <p class="demo-eyebrow">Design goals</p>
            <h2 id="pillars-heading">How the public site should feel</h2>
          </div>
        </div>

        <div class="site-home__pillar-grid">
          @for (pillar of pillars; track pillar.title) {
            <article class="demo-card demo-card--stack site-home__pillar-card">
              <h3>{{ pillar.title }}</h3>
              <p class="demo-card__summary">{{ pillar.description }}</p>
            </article>
          }
        </div>
      </section>

      <!-- Roadmap -->
      <section class="site-home__section" aria-labelledby="roadmap-heading">
        <div class="site-home__section-heading">
          <div>
            <p class="demo-eyebrow">Roadmap</p>
            <h2 id="roadmap-heading">Planned and proposed packages</h2>
          </div>
          <p class="demo-card__summary">
            The landing page shows a curated roadmap slice and links back to the deeper package
            catalog in the repo docs.
          </p>
        </div>

        <div class="site-home__roadmap-grid">
          @for (packageEntry of roadmapPackages; track packageEntry.id) {
            <article
              class="demo-card demo-card--stack site-home__roadmap-card"
              [attr.data-testid]="'site-home-roadmap-' + packageEntry.id"
            >
              <div class="site-home__package-header">
                <div class="site-home__package-title">
                  <p class="demo-eyebrow">{{ packageEntry.scope }}</p>
                  <h3>{{ packageEntry.packageName }}</h3>
                </div>
                <span class="site-status-badge site-status-badge--muted">{{
                  packageEntry.status
                }}</span>
              </div>

              <p class="demo-card__summary">{{ packageEntry.summary }}</p>

              <div class="demo-link-row">
                <a
                  class="demo-link-chip"
                  [href]="packageEntry.docsHref"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open roadmap brief
                </a>
              </div>
            </article>
          }
        </div>
      </section>
    </section>
  `,
  styleUrl: './site-home-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHomePageComponent {
  readonly actions = SITE_PRIMARY_ACTIONS;
  readonly metrics = SITE_METRICS;
  readonly allPackages = getUnifiedPackages();
  readonly pillars = SITE_PILLARS;
  readonly roadmapPackages = SITE_ROADMAP_PACKAGES;
  readonly sharedApiConsumers = SITE_SHARED_API_CONSUMERS;

  readonly sectionCollapsedLimit = SECTION_COLLAPSED_LIMIT;
  readonly showAll = signal(false);
  readonly activeFilter = signal<UnifiedScope | 'All'>('All');

  readonly filterOptions: readonly { scope: UnifiedScope | 'All'; label: string }[] = [
    { scope: 'All', label: 'All' },
    { scope: 'Angular', label: 'Angular' },
    { scope: '.NET', label: '.NET' },
    { scope: 'Cross-stack', label: 'Cross-stack' },
  ];

  protected readonly filteredPackages = () => {
    const filter = this.activeFilter();
    const all = this.allPackages;

    const filtered =
      filter === 'All' ? all : all.filter((p) => p.scope === filter);

    return this.showAll() ? filtered : filtered.slice(0, this.sectionCollapsedLimit);
  };
}
