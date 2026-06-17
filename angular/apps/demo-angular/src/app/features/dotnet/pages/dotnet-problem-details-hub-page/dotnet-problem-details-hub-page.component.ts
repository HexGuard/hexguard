import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DotnetPackageHubPageComponent } from '../../../../shared/components/dotnet-package-hub-page/dotnet-package-hub-page.component';
import { getDotnetSitePackage, SITE_ECOSYSTEMS } from '../../../../site-catalog';

@Component({
  standalone: true,
  selector: 'demo-dotnet-problem-details-hub-page',
  imports: [DotnetPackageHubPageComponent, RouterLink],
  template: `
    <demo-dotnet-package-hub-page
      [entry]="packageEntry"
      overviewTestId="dotnet-pkg-hexguard-problem-details"
      demoTestIdPrefix="dotnet-demo-"
    />

    <article class="demo-card demo-card--stack ecosystem-link-card">
      <p class="demo-eyebrow">Package ecosystem</p>
      <h3>{{ ecosystem.label }}</h3>
      <p class="demo-card__summary">
        This package serves as the <strong>Foundation</strong> layer in a
        {{ ecosystem.members.length }}-package ecosystem. View all {{ ecosystem.members.length }}
        packages and how they work together.
      </p>
      <div class="demo-link-row">
        <a class="demo-link-chip" [routerLink]="'/ecosystems/' + ecosystem.id">
          View {{ ecosystem.label }} ecosystem
        </a>
      </div>
    </article>
  `,
  styles: [`
    .ecosystem-link-card { margin-top: 1.6rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DotnetProblemDetailsHubPageComponent {
  readonly packageEntry = getDotnetSitePackage('hexguard-problem-details');
  readonly ecosystem = SITE_ECOSYSTEMS.find((e) => e.id === 'rfc-9457-problem-details')!;
}
