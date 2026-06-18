import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DotnetPackageHubPageComponent } from '../../../../shared/components/dotnet-package-hub-page/dotnet-package-hub-page.component';
import { getDotnetSitePackage, SITE_ECOSYSTEMS } from '../../../../site-catalog';

@Component({
  standalone: true,
  selector: 'demo-dotnet-bulk-operations-hub-page',
  imports: [DotnetPackageHubPageComponent, RouterLink],
  template: `
    <demo-dotnet-package-hub-page
      [entry]="packageEntry"
      overviewTestId="dotnet-pkg-hexguard-bulk-operations"
      demoTestIdPrefix="dotnet-demo-"
    />

    @if (ecosystem) {
      <article class="demo-card demo-card--stack ecosystem-link-card">
        <p class="demo-eyebrow">Package ecosystem</p>
        <h3>{{ ecosystem.label }}</h3>
        <p class="demo-card__summary">
          This package pairs with
          <strong>@hexguard/angular-bulk-operations</strong> as the Provider layer. View how both
          packages work together.
        </p>
        <a
          class="site-cta"
          routerLink="/ecosystems/{{ ecosystem.id }}"
          [attr.data-testid]="'ecosystem-link-' + ecosystem.id"
        >
          View ecosystem &rarr;
        </a>
      </article>
    }
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
export class DotnetBulkOperationsHubPageComponent {
  readonly packageEntry = getDotnetSitePackage('hexguard-bulk-operations');
  readonly ecosystem = SITE_ECOSYSTEMS.find((e) => e.id === 'bulk-operations');
}
