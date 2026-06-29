import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getSitePackage } from '../../../../site-catalog';
import { PackageHubPageComponent } from '../../../../shared/components/package-hub-page.component';

@Component({
  standalone: true,
  selector: 'demo-angular-form-utils-home-page',
  imports: [PackageHubPageComponent],
  template: `<demo-package-hub-page [packageEntry]="packageEntry" overviewTestId="package-angular-form-utils" demoTestIdPrefix="package-form-utils-demo-" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularFormUtilsHomePageComponent {
  readonly packageEntry = getSitePackage('angular-form-utils');
}
