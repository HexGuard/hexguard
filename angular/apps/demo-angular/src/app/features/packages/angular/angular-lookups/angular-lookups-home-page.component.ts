import { ChangeDetectionStrategy, Component } from '@angular/core';

import { getSitePackage } from '../../../../site-catalog';
import { PackageHubPageComponent } from '../../../../shared/components/package-hub-page.component';

@Component({
  standalone: true,
  selector: 'demo-angular-lookups-home-page',
  imports: [PackageHubPageComponent],
  template: `
    <demo-package-hub-page
      [packageEntry]="packageEntry"
      overviewTestId="package-angular-lookups"
      demoTestIdPrefix="package-lookups-demo-"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularLookupsHomePageComponent {
  readonly packageEntry = getSitePackage('angular-lookups');
}
