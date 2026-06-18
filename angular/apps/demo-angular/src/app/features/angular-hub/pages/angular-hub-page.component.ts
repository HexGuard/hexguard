import { ChangeDetectionStrategy, Component } from '@angular/core';

import { StackOverviewPageComponent } from '../../../shared/components/stack-overview-page/stack-overview-page.component';

@Component({
  standalone: true,
  selector: 'demo-angular-hub-page',
  imports: [StackOverviewPageComponent],
  template: ` <demo-stack-overview-page stackId="angular" testId="angular-hub-page" /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularHubPageComponent {}
