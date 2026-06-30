import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getSitePackage } from '../../../../site-catalog';
import { PackageHubPageComponent } from '../../../../shared/components/package-hub-page.component';

@Component({
  standalone: true,
  selector: 'demo-angular-skeleton-home-page',
  imports: [PackageHubPageComponent],
  template: `<demo-package-hub-page
    [packageEntry]="packageEntry"
    overviewTestId="package-angular-skeleton"
    demoTestIdPrefix="package-skeleton-demo-"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularSkeletonHomePageComponent {
  readonly packageEntry = getSitePackage('angular-skeleton');
}
