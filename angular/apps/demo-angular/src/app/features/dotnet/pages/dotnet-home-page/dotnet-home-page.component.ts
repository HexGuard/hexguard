import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SITE_DOTNET_PACKAGES } from '../../../../site-catalog';

@Component({
  standalone: true,
  selector: 'demo-dotnet-home-page',
  imports: [RouterLink],
  template: `
    <section class="dotnet-home" data-testid="dotnet-home-page">
      <article class="demo-card demo-card--stack">
        <div>
          <p class="demo-eyebrow">HexGuard .NET</p>
          <h2>.NET guardrail libraries and shared demo API</h2>
          <p class="demo-card__summary">
            The .NET workspace provides NuGet libraries for backend catalog contracts, validation,
            and reference-data patterns, all demonstrated through the shared
            <code>HexGuard.SampleApi</code>. Start the API with
            <code>pnpm dotnet:start:demo-api</code> to enable live backend demos.
          </p>
        </div>
      </article>

      @for (packageEntry of dotnetPackages; track packageEntry.id) {
        <section
          class="dotnet-home__section"
          [attr.data-testid]="'dotnet-package-section-' + packageEntry.id"
        >
          <div class="dotnet-home__section-heading">
            <p class="demo-eyebrow">{{ packageEntry.id }}</p>
            <h2>{{ packageEntry.packageName }}</h2>
            <p class="demo-card__summary">{{ packageEntry.summary }}</p>
          </div>

          <div class="dotnet-home__grid">
            @for (demo of packageEntry.dotnetPackage.demos; track demo.id) {
              <article
                class="demo-card demo-card--stack dotnet-home__card"
                [attr.data-testid]="'dotnet-demo-card-' + demo.id"
              >
                <div class="dotnet-home__card-header">
                  <div class="dotnet-home__card-title">
                    <p class="demo-eyebrow">{{ demo.label }}</p>
                    <h3>{{ demo.title }}</h3>
                  </div>
                </div>

                <p class="demo-card__summary">{{ demo.description }}</p>

                <div class="dotnet-home__card-footer">
                  <a
                    class="site-home__action"
                    [routerLink]="demo.route"
                    [attr.data-testid]="'dotnet-demo-link-' + demo.id"
                  >
                    Open demo
                  </a>
                </div>
              </article>
            }
          </div>
        </section>
      }

      <section class="dotnet-home__section">
        <div class="demo-card demo-card--stack">
          <p class="demo-eyebrow">Getting started</p>
          <h3>Run the .NET demo API</h3>
          <p class="demo-card__summary">
            The shared demo API serves all backend endpoints used by both Angular and .NET demos.
          </p>
          <pre class="demo-code-block">pnpm dotnet:start:demo-api</pre>
          <p class="demo-card__summary">
            The API listens on <code>http://127.0.0.1:5074</code> by default and serves
            package-scoped routes under <code>/api/&#123;package-id&#125;/...</code>.
          </p>
        </div>
      </section>

      <section class="dotnet-home__section">
        <div class="demo-card demo-card--stack">
          <p class="demo-eyebrow">Cross-stack demos</p>
          <h3>Angular demos with live backend integration</h3>
          <p class="demo-card__summary">
            Several Angular demos can connect to the running SampleApi for real HTTP integration.
            Look for the "Load from API" toggle on the following pages:
          </p>
          <ul>
            <li>
              <a [routerLink]="'/packages/angular-lookups/backend'" class="demo-link-chip"
                >Lookups Backend Integration</a
              >
            </li>
            <li>
              <a [routerLink]="'/packages/angular-async-state/value'" class="demo-link-chip"
                >Async State Value Lifecycle</a
              >
            </li>
            <li>
              <a [routerLink]="'/packages/angular-optimistic-state/toggle'" class="demo-link-chip"
                >Optimistic Toggle Demo</a
              >
            </li>
            <li>
              <a [routerLink]="'/packages/angular-permissions/actions'" class="demo-link-chip"
                >Permissions Action Gating</a
              >
            </li>
          </ul>
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
