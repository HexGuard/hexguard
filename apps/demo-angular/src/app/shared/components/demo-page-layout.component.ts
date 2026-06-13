import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'demo-page-layout',
  standalone: true,
  templateUrl: './demo-page-layout.component.html',
  styleUrl: './demo-page-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoPageLayoutComponent {
  readonly testId = input.required<string>();
}
