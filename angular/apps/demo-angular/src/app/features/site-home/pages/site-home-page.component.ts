import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  SITE_CURRENT_PACKAGES,
  SITE_METRICS,
  SITE_PILLARS,
  SITE_PRIMARY_ACTIONS,
  SITE_ROADMAP_PACKAGES,
} from '../../../site-catalog';

@Component({
  standalone: true,
  selector: 'demo-site-home-page',
  imports: [RouterLink],
  template: `
    <section class="site-home" data-testid="site-home-page">
      <article class="site-home__hero demo-card demo-card--stack">
        <div class="site-home__hero-grid">
          <div class="site-home__hero-copy">
            <p class="demo-eyebrow">Open-source guardrails</p>
            <h2>
              Production-minded Angular packages and demos available today, broader HexGuard
              packages next.
            </h2>
            <p class="demo-card__summary site-home__lede">
              HexGuard is a monorepo for small, explicit application guardrails. The current public
              surface includes available Angular packages with live demos, while the roadmap
              previews the next Angular, .NET, and cross-stack contracts under active design.
            </p>

            <div class="site-home__actions">
              @for (action of actions; track action.href) {
                <a class="site-home__action" [href]="action.href" target="_blank" rel="noreferrer">
                  {{ action.label }}
                </a>
              }
            </div>
          </div>

          <div class="site-home__hero-panel">
            <p class="demo-eyebrow">Current surface</p>
            <p class="site-home__hero-panel-copy">
              Live packages, test-backed demos, and docs that stay close to the implementation.
            </p>

            <dl class="site-home__metrics" aria-label="Repository metrics">
              @for (metric of metrics; track metric.label) {
                <div class="site-home__metric">
                  <dt>{{ metric.label }}</dt>
                  <dd>{{ metric.value }}</dd>
                </div>
              }
            </dl>
          </div>
        </div>
      </article>

      <section class="site-home__section" aria-labelledby="featured-packages-heading">
        <div class="site-home__section-heading">
          <div>
            <p class="demo-eyebrow">Current packages</p>
            <h2 id="featured-packages-heading">Live package hubs with runnable demos</h2>
          </div>
          <p class="demo-card__summary">
            Each package hub links to docs, GitHub source, and the same demo routes that back
            Playwright coverage.
          </p>
        </div>

        <div class="site-home__package-grid">
          @for (packageEntry of currentPackages; track packageEntry.id) {
            <article
              class="demo-card demo-card--stack site-home__package-card"
              [attr.data-testid]="'site-home-featured-package-' + packageEntry.id"
            >
              <div class="site-home__package-header">
                <div class="site-home__package-title">
                  <p class="demo-eyebrow">{{ packageEntry.scope }}</p>
                  <h3>{{ packageEntry.packageName }}</h3>
                </div>
                <span
                  class="site-status-badge site-home__package-status"
                  [attr.data-testid]="'site-home-featured-package-status-' + packageEntry.id"
                  >{{ packageEntry.status }}</span
                >
              </div>

              <p class="demo-card__summary">{{ packageEntry.summary }}</p>
              <p class="site-home__detail">{{ packageEntry.detail }}</p>

              <ul class="site-home__highlights" aria-label="Package highlights">
                @for (highlight of packageEntry.featureHighlights; track highlight) {
                  <li>{{ highlight }}</li>
                }
              </ul>

              <div class="site-home__package-footer">
                <div class="site-home__package-meta">
                  <span class="demo-hint-pill">{{ packageEntry.demoCount }} live demos</span>
                </div>

                <div class="demo-link-row site-home__package-links">
                  <a
                    class="site-home__action site-home__action--inline"
                    [routerLink]="packageEntry.route"
                    >Open package hub</a
                  >
                  <a
                    class="demo-link-chip"
                    [href]="packageEntry.repositoryHref"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View package source
                  </a>
                  <a
                    class="demo-link-chip"
                    [href]="packageEntry.docsLinks[0]?.href"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Package docs
                  </a>
                </div>
              </div>
            </article>
          }
        </div>
      </section>

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
  readonly currentPackages = SITE_CURRENT_PACKAGES;
  readonly pillars = SITE_PILLARS;
  readonly roadmapPackages = SITE_ROADMAP_PACKAGES;
}
