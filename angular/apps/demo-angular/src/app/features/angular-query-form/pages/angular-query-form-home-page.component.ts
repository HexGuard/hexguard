import { ChangeDetectionStrategy, Component } from '@angular/core';

import { getSitePackage } from '../../../site-catalog';
import { PackageHubPageComponent } from '../../../shared/components/package-hub-page.component';

@Component({
  standalone: true,
  selector: 'demo-angular-query-form-home-page',
  imports: [PackageHubPageComponent],
  template: `
    <demo-package-hub-page
      [packageEntry]="packageEntry"
      overviewTestId="package-angular-query-form"
      demoTestIdPrefix="package-query-form-demo-"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularQueryFormHomePageComponent {
  readonly packageEntry = getSitePackage('angular-query-form');
}
