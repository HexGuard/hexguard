import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DotnetPackageHubPageComponent } from '../../../../shared/components/dotnet-package-hub-page/dotnet-package-hub-page.component';
import { getDotnetSitePackage, SITE_ECOSYSTEMS } from '../../../../site-catalog';

@Component({
  standalone: true,
  selector: 'demo-dotnet-feature-flags-hub-page',
  imports: [DotnetPackageHubPageComponent, RouterLink],
  template: `
    <demo-dotnet-package-hub-page
      [entry]="packageEntry"
      overviewTestId="dotnet-pkg-hexguard-feature-flags"
      demoTestIdPrefix="dotnet-demo-"
    />

    <article class="demo-card demo-card--stack ecosystem-link-card">
      <p class="demo-eyebrow">Package ecosystem</p>
      <h3>{{ ecosystem.label }}</h3>
      <p class="demo-card__summary">
        This package serves as the <strong>Provider</strong> layer in a
        {{ ecosystem.members.length }}-package ecosystem. View all {{ ecosystem.members.length }}
        packages and how they work together.
      </p>
      <a
        class="site-cta"
        routerLink="/ecosystems/{{ ecosystem.id }}"
        [attr.data-testid]="'ecosystem-link-' + ecosystem.id"
      >
        View ecosystem &rarr;
      </a>
    </article>
  `,
  styles: [
    `
      .ecosystem-link-card {
        display: grid;
        gap: 0.5rem;
        background: rgba(248, 252, 251, 0.7);
        border-color: rgba(13, 73, 82, 0.12);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DotnetFeatureFlagsHubPageComponent {
  readonly packageEntry = getDotnetSitePackage('hexguard-feature-flags');
  readonly ecosystem = SITE_ECOSYSTEMS.find((e) => e.id === 'feature-flags')!;
}
