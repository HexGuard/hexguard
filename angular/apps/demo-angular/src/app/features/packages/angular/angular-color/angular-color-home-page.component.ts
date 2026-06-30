import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getSitePackage } from '../../../../site-catalog';
import { PackageHubPageComponent } from '../../../../shared/components/package-hub-page.component';

@Component({
  standalone: true,
  selector: 'demo-angular-color-home-page',
  imports: [PackageHubPageComponent],
  template: `
    <demo-package-hub-page
      [packageEntry]="packageEntry"
      overviewTestId="package-angular-color"
      demoTestIdPrefix="package-color-demo-"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularColorHomePageComponent {
  readonly packageEntry = getSitePackage('angular-color');
}
