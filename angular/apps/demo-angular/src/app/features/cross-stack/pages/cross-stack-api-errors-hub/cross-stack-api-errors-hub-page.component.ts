import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EcosystemHubComponent } from '../../../../shared/components/ecosystem-hub/ecosystem-hub.component';
import { SITE_ECOSYSTEMS } from '../../../../site-catalog';

@Component({
  standalone: true,
  selector: 'demo-cross-stack-api-errors-hub-page',
  imports: [EcosystemHubComponent],
  template: `
    <demo-ecosystem-hub
      [ecosystem]="ecosystem"
      testId="ecosystem-rfc-9457"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrossStackApiErrorsHubPageComponent {
  readonly ecosystem = SITE_ECOSYSTEMS.find((e) => e.id === 'rfc-9457-problem-details')!;
}
