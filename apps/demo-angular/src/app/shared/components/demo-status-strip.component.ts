import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'demo-status-strip',
  standalone: true,
  template: `
    <div class="demo-status-strip" [attr.data-testid]="testId()">
      <p [attr.data-testid]="summaryTestId()">{{ summary() }}</p>
      <code [attr.data-testid]="urlTestId()">{{ currentUrl() }}</code>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoStatusStripComponent {
  readonly summary = input.required<string>();
  readonly currentUrl = input.required<string>();
  readonly summaryTestId = input.required<string>();
  readonly urlTestId = input.required<string>();
  readonly testId = input.required<string>();
}
