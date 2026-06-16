import { ChangeDetectionStrategy, Component } from '@angular/core';

import { getSitePackage } from '../../../site-catalog';
import { PackageHubPageComponent } from '../../../shared/components/package-hub-page.component';

@Component({
  standalone: true,
  selector: 'demo-angular-api-errors-home-page',
  imports: [PackageHubPageComponent],
  template: `
    <demo-package-hub-page
      [packageEntry]="packageEntry"
      overviewTestId="package-angular-api-errors"
      demoTestIdPrefix="package-api-errors-demo-"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularApiErrorsHomePageComponent {
  readonly packageEntry = getSitePackage('angular-api-errors');
}
