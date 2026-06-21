import { ChangeDetectionStrategy, Component } from '@angular/core';

import { getSitePackage } from '../../../../site-catalog';
import { PackageHubPageComponent } from '../../../../shared/components/package-hub-page.component';

@Component({
  standalone: true,
  selector: 'demo-angular-async-state-home-page',
  imports: [PackageHubPageComponent],
  template: `
    <demo-package-hub-page
      [packageEntry]="packageEntry"
      overviewTestId="package-angular-async-state"
      demoTestIdPrefix="package-async-state-demo-"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularAsyncStateHomePageComponent {
  readonly packageEntry = getSitePackage('angular-async-state');
}
