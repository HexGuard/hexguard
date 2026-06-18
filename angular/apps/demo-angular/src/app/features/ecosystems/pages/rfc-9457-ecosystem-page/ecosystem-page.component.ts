import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EcosystemHubComponent } from '../../../../shared/components/ecosystem-hub/ecosystem-hub.component';
import { SITE_ECOSYSTEMS } from '../../../../site-catalog';

@Component({
  standalone: true,
  selector: 'demo-ecosystem-page',
  imports: [EcosystemHubComponent],
  template: `
    @if (ecosystem; as eco) {
      <demo-ecosystem-hub [ecosystem]="eco" [testId]="'ecosystem-' + eco.id" />
    } @else {
      <p class="demo-card__summary">Ecosystem not found.</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcosystemPageComponent {
  readonly ecosystem: typeof SITE_ECOSYSTEMS[number] | null;

  constructor(route: ActivatedRoute) {
    const id = route.snapshot.paramMap.get('id');
    this.ecosystem = SITE_ECOSYSTEMS.find((e) => e.id === id) ?? null;
  }
}
