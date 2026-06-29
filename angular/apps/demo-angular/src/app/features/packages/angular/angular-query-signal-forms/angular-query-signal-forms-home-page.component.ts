import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getSitePackage } from '../../../../site-catalog';
import { PackageHubPageComponent } from '../../../../shared/components/package-hub-page.component';

@Component({
  standalone: true,
  selector: 'demo-angular-query-signal-forms-home-page',
  imports: [PackageHubPageComponent],
  template: `<demo-package-hub-page [packageEntry]="packageEntry" overviewTestId="package-angular-query-signal-forms" demoTestIdPrefix="package-query-signal-forms-demo-" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularQuerySignalFormsHomePageComponent {
  readonly packageEntry = getSitePackage('angular-query-signal-forms');
}
