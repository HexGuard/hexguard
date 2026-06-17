import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DotnetPackageHubPageComponent } from '../../../../shared/components/dotnet-package-hub-page/dotnet-package-hub-page.component';
import { getDotnetSitePackage } from '../../../../site-catalog';

@Component({
  standalone: true,
  selector: 'demo-dotnet-reference-data-hub-page',
  imports: [DotnetPackageHubPageComponent],
  template: `
    <demo-dotnet-package-hub-page
      [entry]="packageEntry"
      overviewTestId="dotnet-pkg-hexguard-reference-data"
      demoTestIdPrefix="dotnet-demo-"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DotnetReferenceDataHubPageComponent {
  readonly packageEntry = getDotnetSitePackage('hexguard-reference-data');
}
