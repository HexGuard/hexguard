import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type {
  Ecosystem,
  EcosystemMember,
  SitePackageCatalogEntry,
  DotnetSitePackageCatalogEntry,
  UnifiedPackageEntry,
} from '../../../site-catalog';
import {
  getUnifiedPackages,
  SITE_CURRENT_PACKAGES,
  SITE_DOTNET_PACKAGES,
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
            <p class="demo-eyebrow">{{ ecosystem().pairingLabel }}</p>
            <h2>{{ ecosystem().label }} ({{ ecosystem().members.length }} packages)</h2>
          </div>
          <div class="eco-hub__header-meta">
            @for (badge of scopeBadges(); track badge) {
              <span class="site-status-badge">{{ badge }}</span>
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
      <article class="demo-card demo-card--stack eco-hub__narrative">
        <div>
          <p class="demo-eyebrow">How they work together</p>
          <h3>{{ ecosystem().label }} — {{ ecosystem().members.length }}-member ecosystem</h3>
        </div>
        @for (note of ecosystem().integrationNotes; track note) {
          <p class="demo-card__summary">{{ note }}</p>
        }
      </article>

      <!-- Demos from all members -->
      <section class="eco-hub__demos" aria-label="Combined demos">
        <div class="eco-hub__demos-heading">
          <div>
            <p class="demo-eyebrow">Live demos</p>
            <h3>Demos from all ecosystem packages</h3>
          </div>
        </div>
        <div class="eco-hub__demos-grid">
          @for (demo of allDemos(); track demo.route) {
            <a
              class="demo-card demo-card--nav eco-hub__demo-card"
              [routerLink]="demo.route"
              [attr.data-testid]="testId() + '-demo-' + demo.id"
            >
              <p class="demo-eyebrow">{{ demo.packageLabel }}</p>
              <h3>{{ demo.demoLabel }}</h3>
              <p class="eco-hub__demo-desc">{{ demo.description }}</p>
            </a>
          }
        </div>
      </section>
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
    .eco-hub__narrative {
      background: rgba(248,252,251,0.7);
      border-color: rgba(13,73,82,0.12);
    }
    .eco-hub__narrative p { max-width: 52rem; }
    .eco-hub__demos { display: grid; gap: 1rem; }
    .eco-hub__demos-heading {
      display: flex; gap: 1rem; align-items: end; justify-content: space-between; flex-wrap: wrap;
    }
    .eco-hub__demos-heading h3 { margin: 0; color: var(--color-ink); }
    .eco-hub__demos-grid {
      display: grid; gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(min(18rem,100%),1fr));
    }
    .eco-hub__demo-card {
      height: 100%; align-content: start;
      background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(247,240,231,0.8));
    }
    .eco-hub__demo-desc {
      margin: 0; color: var(--color-muted); line-height: 1.55;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcosystemHubComponent {
  readonly ecosystem = input.required<Ecosystem>();
  readonly testId = input.required<string>();

  private readonly allUnified = getUnifiedPackages();

  /** Unique scopes represented among the ecosystem members. */
  readonly scopeBadges = computed(() => {
    const scopes = new Set<string>();
    for (const m of this.ecosystem().members) {
      const angularPkg = SITE_CURRENT_PACKAGES.find((p) => p.id === m.packageId);
      if (angularPkg) {
        scopes.add(angularPkg.scope);
      } else {
        const dotnetPkg = SITE_DOTNET_PACKAGES.find((p) => p.id === m.packageId);
        if (dotnetPkg) scopes.add('.NET');
      }
    }
    return [...scopes];
  });

  /** All demos from all member packages. */
  readonly allDemos = computed(() => {
    const result: { id: string; route: string; packageLabel: string; demoLabel: string; description: string }[] = [];
    for (const m of this.ecosystem().members) {
      const angularPkg = SITE_CURRENT_PACKAGES.find((p) => p.id === m.packageId);
      if (angularPkg) {
        for (const demo of angularPkg.demoPackage.demos) {
          result.push({
            id: demo.id,
            route: demo.route,
            packageLabel: angularPkg.packageName,
            demoLabel: demo.label,
            description: demo.description,
          });
        }
      } else {
        const dotnetPkg = SITE_DOTNET_PACKAGES.find((p) => p.id === m.packageId);
        if (dotnetPkg) {
          for (const demo of dotnetPkg.dotnetPackage.demos) {
            result.push({
              id: demo.id,
              route: demo.route,
              packageLabel: dotnetPkg.packageName,
              demoLabel: demo.label,
              description: demo.description,
            });
          }
        }
      }
    }
    return result;
  });

  /** Resolve a unified entry for a member by its package ID. */
  unifiedEntry(packageId: string) {
    const found = this.allUnified.find((p) => p.id === packageId);
    if (!found) {
      throw new Error(`[EcosystemHub] Missing unified entry for ${packageId}`);
    }
    return found;
  }
}
