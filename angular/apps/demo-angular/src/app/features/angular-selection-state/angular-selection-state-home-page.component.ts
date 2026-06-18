import { ChangeDetectionStrategy, Component } from '@angular/core';

import { getSitePackage } from '../../site-catalog';
import { PackageHubPageComponent } from '../../shared/components/package-hub-page.component';

@Component({
  standalone: true,
  selector: 'demo-angular-selection-state-home-page',
  imports: [PackageHubPageComponent],
  template: `
    <demo-package-hub-page
      [packageEntry]="packageEntry"
      overviewTestId="package-angular-selection-state"
      demoTestIdPrefix="package-selection-state-demo-"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularSelectionStateHomePageComponent {
  readonly packageEntry = getSitePackage('angular-selection-state');
}
