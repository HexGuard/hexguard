import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EcosystemHubComponent } from '../../../../shared/components/ecosystem-hub/ecosystem-hub.component';
import { SITE_ECOSYSTEMS } from '../../../../site-catalog';

@Component({
  standalone: true,
  selector: 'demo-rfc-9457-ecosystem-page',
  imports: [EcosystemHubComponent],
  template: `
    <demo-ecosystem-hub
      [ecosystem]="ecosystem"
      testId="rfc-9457-ecosystem-page"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Rfc9457EcosystemPageComponent {
  readonly ecosystem = SITE_ECOSYSTEMS.find((e) => e.id === 'rfc-9457-problem-details')!;
}
