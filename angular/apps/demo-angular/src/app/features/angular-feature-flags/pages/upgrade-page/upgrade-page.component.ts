import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DemoPageLayoutComponent } from '../../../../shared/components/demo-page-layout.component';

@Component({
  standalone: true,
  selector: 'demo-upgrade-page',
  imports: [DemoPageLayoutComponent, RouterLink],
  template: `
    <demo-page-layout testId="upgrade-page">
      <section demoPrimary data-testid="upgrade-page">
        <h2 data-testid="upgrade-title">Upgrade Required</h2>
        <p data-testid="upgrade-description">The <code>premium-feature-x</code> flag is not enabled for your current persona.</p>
        <p data-testid="upgrade-hint">Try selecting a <strong>Premium User</strong> or <strong>Admin</strong> persona
          from the routing demo page to access this content.</p>
        <a routerLink="/packages/angular-feature-flags/routing" data-testid="upgrade-back-link">← Back to routing demo</a>
      </section>
    </demo-page-layout>
  `,
  styles: [`
    .upgrade-page {
      padding: 2rem;
      text-align: center;
    }
    .upgrade-page h2 {
      margin-bottom: 1rem;
      color: #ef4444;
    }
    .upgrade-page p {
      color: var(--color-text-secondary);
      margin-bottom: 1rem;
    }
    .upgrade-page a {
      display: inline-block;
      margin-top: 1rem;
      color: var(--color-link);
      text-decoration: underline;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpgradePageComponent {}
