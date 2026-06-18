import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PackageCardComponent } from '../../../../shared/components/package-card/package-card.component';
import { StackHubLayoutComponent } from '../../../../shared/components/stack-hub-layout/stack-hub-layout.component';
import { SITE_DOTNET_PACKAGES, STACK_REGISTRY, toUnifiedDotnetEntry } from '../../../../site-catalog';

@Component({
  standalone: true,
  selector: 'demo-dotnet-home-page',
  imports: [PackageCardComponent, RouterLink, StackHubLayoutComponent],
  template: `
    <demo-stack-hub-layout testId="dotnet-home-page">
      <div heroContent>
        <p class="demo-eyebrow">{{ stackDef.label }} packages</p>
        <h2>.NET guardrail libraries and shared demo API</h2>
        <p class="demo-card__summary stack-overview__lede">
          {{ stackDef.description }}
        </p>
      </div>

      <div sections>
        <!-- Package cards with inline demo links -->
        <section class="stack-overview__section" aria-labelledby="dotnet-packages-heading">
          <div class="stack-overview__section-heading">
            <div>
              <p class="demo-eyebrow">{{ stackDef.packageLabel }} packages</p>
              <h2 id="dotnet-packages-heading">
                {{ dotnetPackages.length }} .NET libraries with live demos
              </h2>
            </div>
            <p class="demo-card__summary">
              Each card links to a dedicated package hub with docs, source, and demo routes.
            </p>
          </div>

          <div class="stack-overview__grid">
            @for (pkg of dotnetPackages; track pkg.id) {
              <div class="dotnet-home__card-group">
                <demo-package-card [entry]="toUnifiedDotnetEntry(pkg)" />

                <!-- Inline demo links -->
                <div class="dotnet-home__demos">
                  @for (demo of pkg.dotnetPackage.demos; track demo.id) {
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
              </div>
            }
          </div>
        </section>

        <!-- Getting started -->
        <section class="stack-overview__section">
          <div class="stack-overview__section-heading">
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
        <section class="stack-overview__section">
          <div class="stack-overview__section-heading">
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
            <a
              class="demo-card demo-card--nav dotnet-home__cross-chip"
              [routerLink]="'/packages/angular-api-errors/backend'"
            >
              <span class="dotnet-home__cross-chip-label">angular-api-errors</span>
              <span class="dotnet-home__cross-chip-desc">Backend Validation</span>
            </a>
          </div>
        </section>
      </div>
    </demo-stack-hub-layout>
  `,
  styleUrl: './dotnet-home-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DotnetHomePageComponent {
  readonly dotnetPackages = SITE_DOTNET_PACKAGES;
  protected readonly stackDef = STACK_REGISTRY.dotnet;
  protected readonly toUnifiedDotnetEntry = toUnifiedDotnetEntry;
}
