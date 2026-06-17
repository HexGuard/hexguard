import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { PackageEcosystem } from '../../../site-catalog';
import {
  getUnifiedPackages,
  SITE_CROSS_STACK_PAIRS,
  type UnifiedScope,
} from '../../../site-catalog';
import { PackageCardComponent } from '../package-card/package-card.component';

@Component({
  selector: 'demo-ecosystem-hub',
  standalone: true,
  imports: [PackageCardComponent, RouterLink],
  template: `
    <section class="eco-hub" [attr.data-testid]="testId()">
      <!-- Overview -->
      <article class="demo-card demo-card--stack eco-hub__overview">
        <div class="eco-hub__header">
          <div class="eco-hub__header-copy">
            <p class="demo-eyebrow">Package ecosystem</p>
            <h2>{{ ecosystem().label }}</h2>
          </div>
          <div class="eco-hub__header-meta">
            @for (member of ecosystem().members; track member.packageId) {
              <span class="site-status-badge">{{ member.scope }}</span>
            }
            <span class="demo-hint-pill">{{ ecosystem().members.length }} packages</span>
          </div>
        </div>

        <p class="demo-card__summary">{{ ecosystem().description }}</p>
      </article>

      <!-- Package cards -->
      <section class="eco-hub__packages" aria-label="Ecosystem packages">
        @for (member of ecosystem().members; track member.packageId) {
          <div class="eco-hub__member-card">
            <demo-package-card [entry]="unifiedEntry(member.packageId)" />
            <span class="eco-hub__role-pill">{{ member.role }}</span>
          </div>
        }
      </section>

      <!-- Integration narrative -->
      @if (ecosystemDescription(); as desc) {
        <article class="demo-card demo-card--stack eco-hub__narrative">
          <div>
            <p class="demo-eyebrow">How they work together</p>
            <h3>{{ ecosystem().label }} — {{ ecosystem().members.length }}-layer stack</h3>
          </div>
          <p class="demo-card__summary">{{ desc }}</p>
        </article>
      }

      <!-- Related cross-stack pairs -->
      @if (crossStackPair(); as pair) {
        <article class="demo-card demo-card--stack eco-hub__related">
          <div>
            <p class="demo-eyebrow">Also in this ecosystem</p>
            <h3>Cross-stack pair: {{ pair.pairingLabel }}</h3>
          </div>
          <p class="demo-card__summary">{{ pair.description }}</p>
          <div class="demo-link-row">
            <a class="demo-link-chip" [routerLink]="'/' + pair.angularId">
              {{ pair.angularLabel }}
            </a>
            <a class="demo-link-chip" [routerLink]="'/dotnet/' + pair.dotnetId">
              {{ pair.dotnetLabel }}
            </a>
          </div>
        </article>
      }
    </section>
  `,
  styles: [`
    :host { display: block; }
    .eco-hub { display: grid; gap: 1.6rem; }
    .eco-hub__overview {
      background:
        radial-gradient(circle at top right, rgba(20,101,111,0.14), transparent 26%),
        radial-gradient(circle at bottom left, rgba(217,119,75,0.08), transparent 22%),
        linear-gradient(180deg, rgba(255,255,255,0.94), rgba(247,240,231,0.82));
    }
    .eco-hub__header {
      display: flex; gap: 1rem 1.25rem; align-items: start;
      justify-content: space-between; flex-wrap: wrap;
    }
    .eco-hub__header-copy {
      display: grid; gap: 0.35rem; min-width: 0; flex: 1 1 18rem;
    }
    .eco-hub__header h2 { margin: 0; color: var(--color-ink); }
    .eco-hub__header-meta {
      display: flex; gap: 0.5rem; align-items: start; flex-wrap: wrap; min-width: 0;
    }
    .eco-hub__packages {
      display: grid; gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(min(18rem,100%),1fr));
    }
    .eco-hub__member-card {
      display: grid; gap: 0.4rem;
    }
    .eco-hub__role-pill {
      justify-self: start;
      padding: 0.2rem 0.55rem; border-radius: 0.4rem;
      background: rgba(13,73,82,0.08); color: var(--color-accent-strong);
      font-family: var(--font-mono); font-size: 0.72rem; font-weight: 600;
    }
    .eco-hub__narrative, .eco-hub__related {
      background: rgba(248,252,251,0.7);
      border-color: rgba(13,73,82,0.12);
    }
    .eco-hub__narrative p, .eco-hub__related p { max-width: 52rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcosystemHubComponent {
  readonly ecosystem = input.required<PackageEcosystem>();
  readonly testId = input.required<string>();

  private readonly allUnified = getUnifiedPackages();

  /** Snapshot of the ecosystem description for the narrative card. */
  readonly ecosystemDescription = computed(() => this.ecosystem().description);

  /** Find a matching cross-stack pair that belongs to this ecosystem. */
  readonly crossStackPair = computed(() =>
    SITE_CROSS_STACK_PAIRS.find(
      (pair) =>
        this.ecosystem().members.some((m) => m.packageId === pair.angularId) ||
        this.ecosystem().members.some((m) => m.packageId === pair.dotnetId),
    ) ?? null,
  );

  /** Resolve a unified entry for a member by its package ID. */
  unifiedEntry(packageId: string) {
    const found = this.allUnified.find((p) => p.id === packageId);
    if (!found) {
      throw new Error(`[EcosystemHub] Missing unified entry for ${packageId}`);
    }
    return found;
  }
}
