import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PackageCardComponent } from '../../../../shared/components/package-card/package-card.component';
import { StackHubLayoutComponent } from '../../../../shared/components/stack-hub-layout/stack-hub-layout.component';
import {
  SITE_DOTNET_PACKAGES,
  STACK_REGISTRY,
  toUnifiedDotnetEntry,
} from '../../../../site-catalog';

const BLAZOR_PACKAGES = SITE_DOTNET_PACKAGES.filter(
  (pkg) => pkg.dotnetPackage.stackId === 'blazor',
);

@Component({
  standalone: true,
  selector: 'demo-blazor-home-page',
  imports: [PackageCardComponent, RouterLink, StackHubLayoutComponent],
  template: `
    <demo-stack-hub-layout testId="blazor-home-page">
      <div heroContent>
        <p class="demo-eyebrow">{{ stackDef.label }} packages</p>
        <h2>Headless Blazor component libraries</h2>
        <p class="demo-card__summary stack-overview__lede">
          {{ stackDef.description }}
        </p>
      </div>

      <div sections class="section-stack">
        <section class="stack-overview__section" aria-labelledby="blazor-packages-heading">
          <div class="stack-overview__section-heading">
            <div>
              <p class="demo-eyebrow">{{ stackDef.packageLabel }} packages</p>
              <h2 id="blazor-packages-heading">
                {{ blazorPackages.length }} Blazor {{ blazorPackages.length === 1 ? 'library' : 'libraries' }} with live demos
              </h2>
            </div>
            <p class="demo-card__summary">
              Each card links to a dedicated package hub with docs, source, and a link to the live
              Blazor Web App demo at
              <a href="http://127.0.0.1:5075" target="_blank" rel="noreferrer">http://127.0.0.1:5075</a>.
            </p>
          </div>

          <div class="stack-overview__grid">
            @for (pkg of blazorPackages; track pkg.id) {
              <div class="dotnet-home__card-group">
                <demo-package-card [entry]="toUnifiedDotnetEntry(pkg)" />

                <div class="dotnet-home__demos">
                  @for (demo of pkg.dotnetPackage.demos; track demo.id) {
                    <a
                      class="dotnet-home__demo-link"
                      [routerLink]="demo.route"
                      [attr.data-testid]="'blazor-demo-link-' + demo.id"
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

        <section class="stack-overview__section" aria-labelledby="blazor-live-heading">
          <div class="stack-overview__section-heading">
            <div>
              <p class="demo-eyebrow">Live demo</p>
              <h2 id="blazor-live-heading">Interactive Blazor Web App</h2>
            </div>
            <p class="demo-card__summary">
              Blazor packages are demonstrated through a live Blazor Web App with interactive
              server-rendered components.
            </p>
          </div>

          <div class="dotnet-home__demos" style="flex-direction: column; gap: 0.75rem;">
            <a
              class="dotnet-home__demo-link"
              href="http://127.0.0.1:5075"
              target="_blank"
              data-testid="blazor-live-demo-link"
            >
              <span class="dotnet-home__demo-label">HexGuard Blazor Demo ↗</span>
              <span class="dotnet-home__demo-desc">
                Open the live Blazor Web App at http://127.0.0.1:5075 to interact with Blazor
                components directly.
              </span>
            </a>
          </div>
        </section>

        <section class="stack-overview__section" aria-labelledby="blazor-server-heading">
          <div class="stack-overview__section-heading">
            <div>
              <p class="demo-eyebrow">Server companions</p>
              <h2 id="blazor-server-heading">.NET libraries for Blazor backends</h2>
            </div>
            <p class="demo-card__summary">
              These .NET backend libraries are natural companions for Blazor apps — pagination,
              feature flags, reference data, and more. Demonstrated through the shared
              <a href="http://127.0.0.1:5074" target="_blank" rel="noreferrer">HexGuard.SampleApi</a>.
            </p>
          </div>

          <div class="stack-overview__grid">
            @for (pkg of serverCompanions; track pkg.id) {
              <demo-package-card [entry]="toUnifiedDotnetEntry(pkg)" />
            }
          </div>
        </section>
      </div>
    </demo-stack-hub-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlazorHomePageComponent {
  readonly stackDef = STACK_REGISTRY['blazor'];
  readonly toUnifiedDotnetEntry = toUnifiedDotnetEntry;

  readonly blazorPackages = BLAZOR_PACKAGES;

  readonly serverCompanions = SITE_DOTNET_PACKAGES.filter(
    (pkg) =>
      !pkg.dotnetPackage.stackId ||
      pkg.dotnetPackage.stackId === 'dotnet',
  );
}
