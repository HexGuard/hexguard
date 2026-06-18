import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'demo-stack-hub-layout',
  standalone: true,
  template: `
    <section class="stack-hub" [attr.data-testid]="testId()">
      <!-- Hero -->
      <article class="demo-card demo-card--stack stack-hub__hero">
        <ng-content select="[heroContent]" />
      </article>

      <!-- Sections -->
      <ng-content select="[sections]" />
    </section>
  `,
  styleUrl: './stack-hub-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackHubLayoutComponent {
  readonly testId = input.required<string>();
}
