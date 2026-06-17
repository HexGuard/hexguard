import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CrossStackPackageHubComponent } from '../../../../shared/components/cross-stack-package-hub/cross-stack-package-hub.component';
import { getCrossStackHubEntry } from '../../../../site-catalog';

@Component({
  standalone: true,
  selector: 'demo-cross-stack-api-errors-hub-page',
  imports: [CrossStackPackageHubComponent],
  template: `
    <demo-cross-stack-package-hub
      [entry]="entry"
      testId="cs-hub-angular-api-errors"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrossStackApiErrorsHubPageComponent {
  readonly entry = getCrossStackHubEntry('angular-api-errors');
}
