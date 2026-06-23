import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getSitePackage } from '../../../../site-catalog';
import { PackageHubPageComponent } from '../../../../shared/components/package-hub-page.component';

@Component({
  standalone: true,
  selector: 'demo-angular-scroll-state-home-page',
  imports: [PackageHubPageComponent],
  template: `
    <demo-package-hub-page
      [packageEntry]="packageEntry"
      overviewTestId="package-angular-scroll-state"
      demoTestIdPrefix="package-scroll-state-demo-"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularScrollStateHomePageComponent {
  readonly packageEntry = getSitePackage('angular-scroll-state');
}
