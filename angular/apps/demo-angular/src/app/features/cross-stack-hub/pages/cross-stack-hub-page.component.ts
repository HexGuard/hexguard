import { ChangeDetectionStrategy, Component } from '@angular/core';

import { StackOverviewPageComponent } from '../../../shared/components/stack-overview-page/stack-overview-page.component';

@Component({
  standalone: true,
  selector: 'demo-cross-stack-hub-page',
  imports: [StackOverviewPageComponent],
  template: ` <demo-stack-overview-page stackId="cross-stack" testId="cross-stack-hub-page" /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrossStackHubPageComponent {}
