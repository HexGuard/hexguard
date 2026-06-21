import { ChangeDetectionStrategy, Component } from '@angular/core';

import { getSitePackage } from '../../../../site-catalog';
import { PackageHubPageComponent } from '../../../../shared/components/package-hub-page.component';

@Component({
  standalone: true,
  selector: 'demo-angular-url-state-home-page',
  imports: [PackageHubPageComponent],
  template: `
    <demo-package-hub-page
      [packageEntry]="packageEntry"
      overviewTestId="package-angular-url-state"
      demoTestIdPrefix="package-demo-"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularUrlStateHomePageComponent {
  readonly packageEntry = getSitePackage('angular-url-state');
}
