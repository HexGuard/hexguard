import { ChangeDetectionStrategy, Component } from '@angular/core';

import { getSitePackage } from '../../site-catalog';
import { PackageHubPageComponent } from '../../shared/components/package-hub-page.component';

@Component({
  standalone: true,
  selector: 'demo-angular-date-utils-home-page',
  imports: [PackageHubPageComponent],
  template: `
    <demo-package-hub-page
      [packageEntry]="packageEntry"
      overviewTestId="package-angular-date-utils"
      demoTestIdPrefix="package-date-utils-demo-"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularDateUtilsHomePageComponent {
  readonly packageEntry = getSitePackage('angular-date-utils');
}
