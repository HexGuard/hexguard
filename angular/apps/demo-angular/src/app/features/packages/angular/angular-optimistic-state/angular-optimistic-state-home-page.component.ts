import { ChangeDetectionStrategy, Component } from '@angular/core';

import { getSitePackage } from '../../../../site-catalog';
import { PackageHubPageComponent } from '../../../../shared/components/package-hub-page.component';

@Component({
  standalone: true,
  selector: 'demo-angular-optimistic-state-home-page',
  imports: [PackageHubPageComponent],
  template: `
    <demo-package-hub-page
      [packageEntry]="packageEntry"
      overviewTestId="package-angular-optimistic-state"
      demoTestIdPrefix="package-optimistic-state-demo-"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularOptimisticStateHomePageComponent {
  readonly packageEntry = getSitePackage('angular-optimistic-state');
}
