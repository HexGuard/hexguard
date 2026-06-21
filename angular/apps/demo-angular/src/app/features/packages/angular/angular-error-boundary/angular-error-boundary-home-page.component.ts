import { ChangeDetectionStrategy, Component } from '@angular/core';

import { getSitePackage } from '../../../../site-catalog';
import { PackageHubPageComponent } from '../../../../shared/components/package-hub-page.component';

@Component({
  standalone: true,
  selector: 'demo-angular-error-boundary-home-page',
  imports: [PackageHubPageComponent],
  template: `
    <demo-package-hub-page
      [packageEntry]="packageEntry"
      overviewTestId="package-angular-error-boundary"
      demoTestIdPrefix="package-error-boundary-demo-"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularErrorBoundaryHomePageComponent {
  readonly packageEntry = getSitePackage('angular-error-boundary');
}
