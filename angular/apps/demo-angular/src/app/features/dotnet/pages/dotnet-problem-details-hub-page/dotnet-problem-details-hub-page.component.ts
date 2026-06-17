import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DotnetPackageHubPageComponent } from '../../../../shared/components/dotnet-package-hub-page/dotnet-package-hub-page.component';
import { getDotnetSitePackage } from '../../../../site-catalog';

@Component({
  standalone: true,
  selector: 'demo-dotnet-problem-details-hub-page',
  imports: [DotnetPackageHubPageComponent],
  template: `
    <demo-dotnet-package-hub-page
      [entry]="packageEntry"
      overviewTestId="dotnet-pkg-hexguard-problem-details"
      demoTestIdPrefix="dotnet-demo-"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DotnetProblemDetailsHubPageComponent {
  readonly packageEntry = getDotnetSitePackage('hexguard-problem-details');
}
