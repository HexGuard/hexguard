import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DotnetPackageHubPageComponent } from '../../../../shared/components/dotnet-package-hub-page/dotnet-package-hub-page.component';
import { getDotnetSitePackage } from '../../../../site-catalog';

@Component({
  standalone: true,
  selector: 'demo-dotnet-hexguard-pagination-hub-page',
  imports: [DotnetPackageHubPageComponent, RouterLink],
  template: `
    <demo-dotnet-package-hub-page
      [entry]="packageEntry"
      overviewTestId="dotnet-pkg-hexguard-pagination"
      demoTestIdPrefix="dotnet-demo-"
    />

    <article class="demo-card demo-card--stack ecosystem-link-card">
      <p class="demo-eyebrow">Cross-stack pairing</p>
      <h3>Angular + .NET Pagination</h3>
      <p class="demo-card__summary">
        <code>HexGuard.Pagination</code> provides the server-side <code>QueryRequest</code> /
        <code>QueryResponse&lt;T&gt;</code> contracts.
        <code>&#64;hexguard/angular-pagination</code> provides the client-side signal-based
        pagination state. Together they deliver end-to-end typed pagination across the stack.
      </p>
      <a
        class="site-cta"
        routerLink="/packages/angular-pagination/demo"
        data-testid="ecosystem-link-angular-pagination"
      >
        View Angular Pagination Demo &rarr;
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
export class DotnetPaginationHubPageComponent {
  readonly packageEntry = getDotnetSitePackage('hexguard-pagination');
}
