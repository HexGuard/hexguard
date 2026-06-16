import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SITE_DOTNET_PACKAGES } from '../../../../site-catalog';

@Component({
  standalone: true,
  selector: 'demo-dotnet-home-page',
  imports: [RouterLink],
  template: `
    <section class="dotnet-home" data-testid="dotnet-home-page">
      <!-- Hero -->
      <article class="demo-card demo-card--stack dotnet-home__hero">
        <div>
          <p class="demo-eyebrow">HexGuard .NET</p>
          <h2>.NET guardrail libraries and shared demo API</h2>
          <p class="demo-card__summary dotnet-home__lede">
            The .NET workspace provides NuGet libraries for backend catalog contracts, validation,
            and reference-data patterns, all demonstrated through the shared
            <code>HexGuard.SampleApi</code>. Start the API with
            <code>pnpm dotnet:start:demo-api</code> to enable live backend demos.
          </p>
        </div>
      </article>

      <!-- Package cards (site-home style) -->
      <section class="dotnet-home__section" aria-labelledby="dotnet-packages-heading">
        <div class="dotnet-home__section-heading">
          <div>
            <p class="demo-eyebrow">NuGet packages</p>
            <h2 id="dotnet-packages-heading">Available .NET libraries with live demos</h2>
          </div>
          <p class="demo-card__summary">
            Each card links to demo routes, source code, and the .NET workspace overview.
          </p>
        </div>

        <div class="dotnet-home__grid">
          @for (packageEntry of dotnetPackages; track packageEntry.id) {
            <article
              class="demo-card demo-card--stack dotnet-home__package-card"
              [attr.data-testid]="'dotnet-package-card-' + packageEntry.id"
            >
              <div class="dotnet-home__package-header">
                <div class="dotnet-home__package-title">
                  <p class="demo-eyebrow">NuGet</p>
                  <h3>{{ packageEntry.packageName }}</h3>
                </div>
                <span
                  class="site-status-badge"
                  [attr.data-testid]="'dotnet-package-status-' + packageEntry.id"
                  >{{ packageEntry.status }}</span
                >
              </div>

              <p class="demo-card__summary">{{ packageEntry.summary }}</p>

              @if (packageEntry.angularCounterpartLabel) {
                <p class="dotnet-home__counterpart">
                  <span class="demo-hint-pill dotnet-home__counterpart-pill"
                    >Angular counterpart: {{ packageEntry.angularCounterpartLabel }}</span
                  >
                  <a class="demo-link-chip" routerLink="/">Open Angular home</a>
                </p>
              }

              <div class="dotnet-home__demos">
                @for (demo of packageEntry.dotnetPackage.demos; track demo.id) {
                  <a
                    class="dotnet-home__demo-link"
                    [routerLink]="demo.route"
                    [attr.data-testid]="'dotnet-demo-link-' + demo.id"
                  >
                    <span class="dotnet-home__demo-label">{{ demo.label }}</span>
                    <span class="dotnet-home__demo-desc">{{ demo.description }}</span>
                  </a>
                }
              </div>

              <div class="dotnet-home__package-footer">
                <div class="dotnet-home__package-meta">
                  <span class="demo-hint-pill">{{ packageEntry.demoCount }} demos</span>
                </div>

                <div class="demo-link-row dotnet-home__package-links">
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
      </section>

      <!-- Getting started -->
      <section class="dotnet-home__section">
        <div class="dotnet-home__section-heading">
          <div>
            <p class="demo-eyebrow">Getting started</p>
            <h2 id="dotnet-start-heading">Run the .NET demo API</h2>
          </div>
          <p class="demo-card__summary">
            The shared demo API serves all backend endpoints used by both Angular and .NET demos.
          </p>
        </div>

        <div class="demo-card demo-card--stack dotnet-home__start-card">
          <pre class="demo-code-block">pnpm dotnet:start:demo-api</pre>
          <p class="demo-card__summary">
            The API listens on <code>http://127.0.0.1:5074</code> by default and serves
            package-scoped routes under <code>/api/&#123;package-id&#125;/...</code>.
          </p>
          <div class="demo-link-row">
            <a
              class="demo-link-chip"
              href="https://github.com/HexGuard/hexguard/tree/main/dotnet/samples/HexGuard.SampleApi"
              target="_blank"
              rel="noreferrer"
            >
              SampleApi source
            </a>
            <a
              class="demo-link-chip"
              href="https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md"
              target="_blank"
              rel="noreferrer"
            >
              Demo runbook
            </a>
          </div>
        </div>
      </section>

      <!-- Cross-stack -->
      <section class="dotnet-home__section">
        <div class="dotnet-home__section-heading">
          <div>
            <p class="demo-eyebrow">Cross-stack demos</p>
            <h2 id="dotnet-cross-heading">Angular demos with live backend integration</h2>
          </div>
          <p class="demo-card__summary">
            Several Angular demos can connect to the running SampleApi for real HTTP integration.
            Look for the "Load from API" toggle on the following pages:
          </p>
        </div>

        <div class="dotnet-home__cross-grid">
          <a
            class="demo-card demo-card--nav dotnet-home__cross-chip"
            [routerLink]="'/packages/angular-lookups/backend'"
          >
            <span class="dotnet-home__cross-chip-label">angular-lookups</span>
            <span class="dotnet-home__cross-chip-desc">Backend Integration</span>
          </a>
          <a
            class="demo-card demo-card--nav dotnet-home__cross-chip"
            [routerLink]="'/packages/angular-async-state/value'"
          >
            <span class="dotnet-home__cross-chip-label">angular-async-state</span>
            <span class="dotnet-home__cross-chip-desc">Value Lifecycle</span>
          </a>
          <a
            class="demo-card demo-card--nav dotnet-home__cross-chip"
            [routerLink]="'/packages/angular-optimistic-state/toggle'"
          >
            <span class="dotnet-home__cross-chip-label">angular-optimistic-state</span>
            <span class="dotnet-home__cross-chip-desc">Toggle Conflict Policy</span>
          </a>
          <a
            class="demo-card demo-card--nav dotnet-home__cross-chip"
            [routerLink]="'/packages/angular-permissions/actions'"
          >
            <span class="dotnet-home__cross-chip-label">angular-permissions</span>
            <span class="dotnet-home__cross-chip-desc">Action Gating</span>
          </a>
        </div>
      </section>
    </section>
  `,
  styleUrl: './dotnet-home-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DotnetHomePageComponent {
  readonly dotnetPackages = SITE_DOTNET_PACKAGES;
}
