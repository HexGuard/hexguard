import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  SITE_CROSS_STACK_PAIRS,
  SITE_CURRENT_PACKAGES,
  SITE_DOTNET_PACKAGES,
  SITE_METRICS,
  SITE_PILLARS,
  SITE_PRIMARY_ACTIONS,
  SITE_ROADMAP_PACKAGES,
  SITE_SHARED_API_CONSUMERS,
  SECTION_COLLAPSED_LIMIT,
  CROSS_STACK_COLLAPSED_LIMIT,
} from '../../../site-catalog';

@Component({
  standalone: true,
  selector: 'demo-site-home-page',
  imports: [RouterLink],
  template: `
    <section class="site-home" data-testid="site-home-page">
      <!-- Hero -->
      <article class="site-home__hero demo-card demo-card--stack">
        <div class="site-home__hero-grid">
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

      <!-- Angular packages -->
      <section class="site-home__section" aria-labelledby="angular-packages-heading">
        <div class="site-home__section-heading">
          <div>
            <p class="demo-eyebrow">Angular packages</p>
            <h2 id="angular-packages-heading">Live package hubs with runnable demos</h2>
          </div>
          <p class="demo-card__summary">
            Each package hub links to docs, GitHub source, and the same demo routes that back
            Playwright coverage.
          </p>
        </div>

        <div class="site-home__package-grid">
          @for (
            packageEntry of angularPackagesExpanded()
              ? currentPackages
              : currentPackages.slice(0, sectionCollapsedLimit);
            track packageEntry.id
          ) {
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

              @if (packageEntry.dotnetCounterpartLabel) {
                <p class="site-home__counterpart">
                  <span class="demo-hint-pill site-home__counterpart-pill"
                    >.NET counterpart: {{ packageEntry.dotnetCounterpartLabel }}</span
                  >
                  <a class="demo-link-chip" routerLink="/dotnet">Open .NET hub</a>
                </p>
              }

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

        @if (currentPackages.length > sectionCollapsedLimit) {
          <button
            class="site-home__expand-toggle"
            type="button"
            (click)="angularPackagesExpanded.set(!angularPackagesExpanded())"
            [attr.data-testid]="'site-home-angular-expand-toggle'"
          >
            {{
              angularPackagesExpanded()
                ? 'Show fewer packages'
                : 'Show all ' + currentPackages.length + ' Angular packages'
            }}
          </button>
        }
      </section>

      <!-- .NET packages -->
      <section class="site-home__section" aria-labelledby="dotnet-packages-heading">
        <div class="site-home__section-heading">
          <div>
            <p class="demo-eyebrow">.NET packages</p>
            <h2 id="dotnet-packages-heading">NuGet libraries and shared demo API</h2>
          </div>
          <p class="demo-card__summary">
            The .NET workspace provides NuGet libraries and a shared SampleApi that backs both
            Angular and .NET demos. Start the API with <code>pnpm dotnet:start:demo-api</code> to
            enable live backend integration.
          </p>
        </div>

        <div class="site-home__package-grid">
          @for (
            packageEntry of dotnetPackagesExpanded()
              ? dotnetPackages
              : dotnetPackages.slice(0, sectionCollapsedLimit);
            track packageEntry.id
          ) {
            <article
              class="demo-card demo-card--stack site-home__package-card"
              [attr.data-testid]="'site-home-dotnet-package-' + packageEntry.id"
            >
              <div class="site-home__package-header">
                <div class="site-home__package-title">
                  <p class="demo-eyebrow">NuGet</p>
                  <h3>{{ packageEntry.packageName }}</h3>
                </div>
                <span
                  class="site-status-badge site-home__package-status"
                  [attr.data-testid]="'site-home-dotnet-status-' + packageEntry.id"
                  >{{ packageEntry.status }}</span
                >
              </div>

              <p class="demo-card__summary">{{ packageEntry.summary }}</p>

              @if (packageEntry.angularCounterpartLabel) {
                <p class="site-home__counterpart">
                  <span class="demo-hint-pill site-home__counterpart-pill"
                    >Angular counterpart: {{ packageEntry.angularCounterpartLabel }}</span
                  >
                  <a class="demo-link-chip" [routerLink]="'/'">Open Angular hub</a>
                </p>
              }

              <div class="site-home__package-footer">
                <div class="site-home__package-meta">
                  <span class="demo-hint-pill">{{ packageEntry.demoCount }} demos</span>
                </div>

                <div class="demo-link-row site-home__package-links">
                  <a
                    class="site-home__action site-home__action--inline"
                    [routerLink]="packageEntry.route"
                    >Open .NET hub</a
                  >
                  <a
                    class="demo-link-chip"
                    [href]="packageEntry.dotnetPackage.docsLinks[0]?.href"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View source
                  </a>
                  <a
                    class="demo-link-chip"
                    [href]="packageEntry.dotnetPackage.docsLinks[2]?.href"
                    target="_blank"
                    rel="noreferrer"
                  >
                    .NET workspace
                  </a>
                </div>
              </div>
            </article>
          }
        </div>

        @if (dotnetPackages.length > sectionCollapsedLimit) {
          <button
            class="site-home__expand-toggle"
            type="button"
            (click)="dotnetPackagesExpanded.set(!dotnetPackagesExpanded())"
            [attr.data-testid]="'site-home-dotnet-expand-toggle'"
          >
            {{
              dotnetPackagesExpanded()
                ? 'Show fewer packages'
                : 'Show all ' + dotnetPackages.length + ' .NET packages'
            }}
          </button>
        }
      </section>

      <!-- Cross-stack packages -->
      <section class="site-home__section" aria-labelledby="cross-stack-heading">
        <div class="site-home__section-heading">
          <div>
            <p class="demo-eyebrow">Cross-stack</p>
            <h2 id="cross-stack-heading">Paired Angular + .NET packages</h2>
          </div>
          <p class="demo-card__summary">
            Packages that share domain concepts, a shared API, or complementary contracts across the
            Angular and .NET workspaces.
          </p>
        </div>

        <div class="site-home__cross-stack-grid">
          @for (
            pair of crossStackExpanded()
              ? crossStackPairs
              : crossStackPairs.slice(0, crossStackCollapsedLimit);
            track pair.angularId
          ) {
            <article
              class="demo-card demo-card--stack site-home__cross-card"
              [attr.data-testid]="'site-home-cross-pair-' + pair.angularId"
            >
              <div class="site-home__cross-header">
                <p class="demo-eyebrow">{{ pair.pairingLabel }}</p>
                <div class="site-home__cross-badges">
                  <span class="site-status-badge">Angular</span>
                  <span class="site-status-badge">.NET</span>
                </div>
              </div>

              <p class="demo-card__summary">{{ pair.description }}</p>

              <div class="site-home__cross-stacks">
                <div class="site-home__cross-stack">
                  <p class="site-home__cross-stack-label">Angular</p>
                  <p class="site-home__cross-stack-name">{{ pair.angularLabel }}</p>
                </div>
                <div class="site-home__cross-stack">
                  <p class="site-home__cross-stack-label">.NET</p>
                  <p class="site-home__cross-stack-name">{{ pair.dotnetLabel }}</p>
                </div>
              </div>

              <div class="demo-link-row site-home__cross-links">
                <a
                  class="site-home__action site-home__action--inline"
                  [routerLink]="'/packages/' + pair.angularId"
                  >Open Angular hub</a
                >
                <a class="site-home__action site-home__action--inline" routerLink="/dotnet"
                  >Open .NET hub</a
                >
              </div>
            </article>
          }
        </div>

        @if (crossStackPairs.length > crossStackCollapsedLimit) {
          <button
            class="site-home__expand-toggle"
            type="button"
            (click)="crossStackExpanded.set(!crossStackExpanded())"
            [attr.data-testid]="'site-home-cross-expand-toggle'"
          >
            {{
              crossStackExpanded()
                ? 'Show fewer pairs'
                : 'Show all ' + crossStackPairs.length + ' cross-stack pairs'
            }}
          </button>
        }

        <!-- Shared API consumers (always visible as a compact list) -->
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
  readonly currentPackages = SITE_CURRENT_PACKAGES;
  readonly dotnetPackages = SITE_DOTNET_PACKAGES;
  readonly crossStackPairs = SITE_CROSS_STACK_PAIRS;
  readonly sharedApiConsumers = SITE_SHARED_API_CONSUMERS;
  readonly pillars = SITE_PILLARS;
  readonly roadmapPackages = SITE_ROADMAP_PACKAGES;

  readonly sectionCollapsedLimit = SECTION_COLLAPSED_LIMIT;
  readonly crossStackCollapsedLimit = CROSS_STACK_COLLAPSED_LIMIT;

  readonly angularPackagesExpanded = signal(false);
  readonly dotnetPackagesExpanded = signal(false);
  readonly crossStackExpanded = signal(false);
}
