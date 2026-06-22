import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getSitePackage } from '../../../../site-catalog';
import { PackageHubPageComponent } from '../../../../shared/components/package-hub-page.component';
@Component({
  standalone: true, selector: 'demo-angular-confirmation-home-page',
  imports: [PackageHubPageComponent],
  template: ` <demo-package-hub-page [packageEntry]="packageEntry" overviewTestId="package-angular-confirmation" demoTestIdPrefix="package-confirmation-demo-" /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularConfirmationHomePageComponent {
  readonly packageEntry = getSitePackage('angular-confirmation');
}
