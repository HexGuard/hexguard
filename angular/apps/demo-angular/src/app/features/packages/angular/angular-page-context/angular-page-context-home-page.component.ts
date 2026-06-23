import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getSitePackage } from '../../../../site-catalog';
import { PackageHubPageComponent } from '../../../../shared/components/package-hub-page.component';

@Component({
  standalone: true,
  selector: 'demo-angular-page-context-home-page',
  imports: [PackageHubPageComponent],
  template: `
    <demo-package-hub-page
      [packageEntry]="packageEntry"
      overviewTestId="package-angular-page-context"
      demoTestIdPrefix="package-page-context-demo-"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularPageContextHomePageComponent {
  readonly packageEntry = getSitePackage('angular-page-context');
}
