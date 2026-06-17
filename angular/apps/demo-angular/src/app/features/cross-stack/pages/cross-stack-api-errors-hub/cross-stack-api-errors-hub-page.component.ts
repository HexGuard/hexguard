import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CrossStackPackageHubComponent } from '../../../../shared/components/cross-stack-package-hub/cross-stack-package-hub.component';
import { getCrossStackHubEntry, SITE_ECOSYSTEMS } from '../../../../site-catalog';

@Component({
  standalone: true,
  selector: 'demo-cross-stack-api-errors-hub-page',
  imports: [CrossStackPackageHubComponent, RouterLink],
  template: `
    <demo-cross-stack-package-hub
      [entry]="entry"
      testId="cs-hub-angular-api-errors"
    />

    <article class="demo-card demo-card--stack cs-ecosystem-link">
      <p class="demo-eyebrow">Multi-package ecosystem</p>
      <h3>{{ ecosystem.label }}</h3>
      <p class="demo-card__summary">
        These packages are part of a broader {{ ecosystem.members.length }}-layer ecosystem.
        See how all {{ ecosystem.members.length }} packages work together.
      </p>
      <div class="demo-link-row">
        <a class="demo-link-chip" [routerLink]="'/ecosystems/' + ecosystem.id">
          View {{ ecosystem.label }} ecosystem
        </a>
      </div>
    </article>
  `,
  styles: [`
    .cs-ecosystem-link { margin-top: 1.6rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrossStackApiErrorsHubPageComponent {
  readonly entry = getCrossStackHubEntry('angular-api-errors');
  readonly ecosystem = SITE_ECOSYSTEMS.find((e) => e.id === 'rfc-9457-problem-details')!;
}
