import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getSitePackage } from '../../../../site-catalog';
import { PackageHubPageComponent } from '../../../../shared/components/package-hub-page.component';

@Component({
  standalone: true,
  selector: 'demo-angular-icon-registry-home-page',
  imports: [PackageHubPageComponent],
  template: `<demo-package-hub-page
    [packageEntry]="packageEntry"
    overviewTestId="package-angular-icon-registry"
    demoTestIdPrefix="package-icon-registry-demo-"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularIconRegistryHomePageComponent {
  readonly packageEntry = getSitePackage('angular-icon-registry');
}
