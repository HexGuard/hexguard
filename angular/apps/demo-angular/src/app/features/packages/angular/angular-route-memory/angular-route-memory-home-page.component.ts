import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getSitePackage } from '../../../../site-catalog';
import { PackageHubPageComponent } from '../../../../shared/components/package-hub-page.component';

@Component({
  standalone: true,
  selector: 'demo-angular-route-memory-home-page',
  imports: [PackageHubPageComponent],
  template: `
    <demo-package-hub-page
      [packageEntry]="packageEntry"
      overviewTestId="package-angular-route-memory"
      demoTestIdPrefix="package-route-memory-demo-"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularRouteMemoryHomePageComponent {
  readonly packageEntry = getSitePackage('angular-route-memory');
}
