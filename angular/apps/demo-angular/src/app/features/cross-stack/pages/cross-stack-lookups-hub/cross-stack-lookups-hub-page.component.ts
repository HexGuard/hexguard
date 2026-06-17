import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CrossStackPackageHubComponent } from '../../../../shared/components/cross-stack-package-hub/cross-stack-package-hub.component';
import { getCrossStackHubEntry } from '../../../../site-catalog';

@Component({
  standalone: true,
  selector: 'demo-cross-stack-lookups-hub-page',
  imports: [CrossStackPackageHubComponent],
  template: `
    <demo-cross-stack-package-hub
      [entry]="entry"
      testId="cs-hub-angular-lookups"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrossStackLookupsHubPageComponent {
  readonly entry = getCrossStackHubEntry('angular-lookups');
}
