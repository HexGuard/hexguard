import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { CrossStackPackageHubEntry } from '../../../site-catalog';
import { PackageCardComponent } from '../package-card/package-card.component';
import { toUnifiedAngularEntry, toUnifiedDotnetEntry } from '../../../site-catalog';

@Component({
  selector: 'demo-cross-stack-package-hub',
  standalone: true,
  imports: [PackageCardComponent, RouterLink],
  template: `
    <section class="cs-pkg-hub" [attr.data-testid]="testId()">
      <!-- Overview -->
      <article class="demo-card demo-card--stack cs-pkg-hub__overview">
        <div class="cs-pkg-hub__header">
          <div class="cs-pkg-hub__header-copy">
            <p class="demo-eyebrow">{{ entry().pairingLabel }}</p>
            <h2>Cross-stack integration</h2>
          </div>
          <div class="cs-pkg-hub__header-meta">
            <span class="site-status-badge">Angular</span>
            <span class="site-status-badge">.NET</span>
            <span class="demo-hint-pill">2 live demos</span>
          </div>
        </div>

        <p class="demo-card__summary">{{ entry().description }}</p>
      </article>

      <!-- Package cards side by side -->
      <section class="cs-pkg-hub__packages" aria-label="Both packages">
        <demo-package-card [entry]="angularUnified()" />
        <demo-package-card [entry]="dotnetUnified()" />
      </section>

      <!-- Integration narrative -->
      <article class="demo-card demo-card--stack cs-pkg-hub__narrative">
        <div>
          <p class="demo-eyebrow">How they work together</p>
          <h3>Cross-stack integration flow</h3>
        </div>

        <div class="cs-pkg-hub__paragraphs">
          @for (note of entry().integrationNotes; track note) {
            <p class="demo-card__summary">{{ note }}</p>
          }
        </div>
      </article>

      <!-- Demos -->
      <section class="cs-pkg-hub__demos" aria-label="Combined demos">
        <div class="cs-pkg-hub__demos-heading">
          <div>
            <p class="demo-eyebrow">Live demos</p>
            <h3>Demos from both packages</h3>
          </div>
          <p class="demo-card__summary">
            Explore how these packages work together through their demo routes.
          </p>
        </div>

        <div class="cs-pkg-hub__demos-grid">
          <!-- Angular demos -->
          @for (demo of entry().angularPackage.demoPackage.demos; track demo.route) {
            <a
              class="demo-card demo-card--nav cs-pkg-hub__demo-card"
              [routerLink]="demo.route"
              [attr.data-testid]="testId() + '-demo-' + demo.id"
            >
              <p class="demo-eyebrow">Angular · {{ entry().angularPackage.packageName }}</p>
              <h3>{{ demo.label }}</h3>
              <p class="cs-pkg-hub__demo-desc">{{ demo.description }}</p>
            </a>
          }
          <!-- .NET demos -->
          @for (demo of entry().dotnetPackage.dotnetPackage.demos; track demo.route) {
            <a
              class="demo-card demo-card--nav cs-pkg-hub__demo-card"
              [routerLink]="demo.route"
              [attr.data-testid]="testId() + '-demo-' + demo.id"
            >
              <p class="demo-eyebrow">.NET · {{ entry().dotnetPackage.packageName }}</p>
              <h3>{{ demo.label }}</h3>
              <p class="cs-pkg-hub__demo-desc">{{ demo.description }}</p>
            </a>
          }
        </div>
      </section>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .cs-pkg-hub { display: grid; gap: 1.6rem; }
    .cs-pkg-hub__overview {
      background:
        radial-gradient(circle at top right, rgba(217,119,75,0.12), transparent 26%),
        radial-gradient(circle at bottom left, rgba(20,101,111,0.12), transparent 22%),
        linear-gradient(180deg, rgba(255,255,255,0.94), rgba(247,240,231,0.82));
    }
    .cs-pkg-hub__header,
    .cs-pkg-hub__demos-heading {
      display: flex; gap: 1rem 1.25rem; align-items: end;
      justify-content: space-between; flex-wrap: wrap;
    }
    .cs-pkg-hub__header { align-items: start; }
    .cs-pkg-hub__header-copy {
      display: grid; gap: 0.35rem; min-width: 0; flex: 1 1 18rem;
    }
    .cs-pkg-hub__header h2,
    .cs-pkg-hub__demos-heading h3,
    .cs-pkg-hub__demo-card h3 {
      margin: 0; color: var(--color-ink);
    }
    .cs-pkg-hub__header h2,
    .cs-pkg-hub__demos-heading h3 {
      line-height: 1.05; letter-spacing: -0.04em;
    }
    .cs-pkg-hub__header-meta {
      display: flex; gap: 0.5rem; align-items: start; flex-wrap: wrap; min-width: 0;
    }
    .cs-pkg-hub__packages {
      display: grid; gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(min(18rem,100%),1fr));
    }
    .cs-pkg-hub__narrative {
      background: rgba(248,252,251,0.72);
      border-color: rgba(13,73,82,0.14);
    }
    .cs-pkg-hub__paragraphs { display: grid; gap: 0.85rem; }
    .cs-pkg-hub__demos { display: grid; gap: 1rem; }
    .cs-pkg-hub__demos-grid {
      display: grid; gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(min(18rem,100%),1fr));
    }
    .cs-pkg-hub__demo-card {
      height: 100%; align-content: start;
      background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(247,240,231,0.8));
    }
    .cs-pkg-hub__demo-desc {
      margin: 0; color: var(--color-muted); line-height: 1.55;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrossStackPackageHubComponent {
  readonly entry = input.required<CrossStackPackageHubEntry>();
  readonly testId = input.required<string>();

  protected readonly angularUnified = () => toUnifiedAngularEntry(this.entry().angularPackage);
  protected readonly dotnetUnified = () => toUnifiedDotnetEntry(this.entry().dotnetPackage);
}
