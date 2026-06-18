import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DemoPageLayoutComponent } from '../../../../shared/components/demo-page-layout.component';

@Component({
  standalone: true,
  selector: 'demo-premium-content-page',
  imports: [DemoPageLayoutComponent],
  template: `
    <demo-page-layout testId="premium-content-page">
      <section demoPrimary data-testid="premium-content-page">
        <h2 data-testid="premium-title">Premium Content</h2>
        <p data-testid="premium-description">This page is only accessible when the <code>premium-feature-x</code> flag is enabled.</p>
        <div class="premium-badge" data-testid="premium-badge">⭐ Premium Feature</div>
      </section>
    </demo-page-layout>
  `,
  styles: [`
    .premium-content {
      padding: 2rem;
      text-align: center;
    }
    .premium-content h2 {
      margin-bottom: 1rem;
    }
    .premium-content p {
      color: var(--color-text-secondary);
      margin-bottom: 1.5rem;
    }
    .premium-badge {
      display: inline-block;
      padding: 0.5rem 1.5rem;
      background: linear-gradient(135deg, #f59e0b, #eab308);
      color: #000;
      font-weight: 700;
      border-radius: 2rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PremiumContentPageComponent {}
