import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getSitePackage } from '../../../../site-catalog';
import { PackageHubPageComponent } from '../../../../shared/components/package-hub-page.component';

@Component({
  standalone: true,
  selector: 'demo-angular-command-palette-home-page',
  imports: [PackageHubPageComponent],
  template: `
    <demo-package-hub-page
      [packageEntry]="packageEntry"
      overviewTestId="package-angular-command-palette"
      demoTestIdPrefix="package-command-palette-demo-"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularCommandPaletteHomePageComponent {
  readonly packageEntry = getSitePackage('angular-command-palette');
}
