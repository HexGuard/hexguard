import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PackageCardComponent } from '../../../shared/components/package-card/package-card.component';
import { StackHubLayoutComponent } from '../../../shared/components/stack-hub-layout/stack-hub-layout.component';
import {
  getUnifiedPackages,
  SITE_SHARED_API_CONSUMERS,
} from '../../../site-catalog';

@Component({
  standalone: true,
  selector: 'demo-cross-stack-hub-page',
  imports: [PackageCardComponent, RouterLink, StackHubLayoutComponent],
  template: `
    <demo-stack-hub-layout testId="cross-stack-hub-page">
      <div heroContent>
        <p class="demo-eyebrow">Cross-stack</p>
        <h2>Angular + .NET integration pairs</h2>
        <p class="demo-card__summary cross-hub__lede">
          Packages that share domain concepts, a shared API, or complementary contracts across the
          Angular and .NET workspaces. Each pair links to a dedicated hub with integration notes,
          combined demo routes, and shared API references.
        </p>
        <div class="demo-link-row">
          <a class="cross-hub__action" routerLink="/angular">Explore Angular packages</a>
          <a class="cross-hub__action" routerLink="/dotnet">Explore .NET packages</a>
        </div>
      </div>

      <div sections>
        <!-- Cross-stack pairs -->
        <section class="cross-hub__section" aria-labelledby="pairs-heading">
          <div class="cross-hub__section-heading">
            <div>
              <p class="demo-eyebrow">Cross-stack pairs</p>
              <h2 id="pairs-heading">{{ crossStackEntries.length }} integration pairs</h2>
            </div>
            <p class="demo-card__summary">
              Each card links to a dedicated cross-stack hub with both Angular and .NET context.
            </p>
          </div>

          <div class="cross-hub__grid">
            @for (entry of crossStackEntries; track entry.id) {
              <demo-package-card [entry]="entry" />
            }
          </div>
        </section>

        <!-- Shared API consumers -->
        @if (sharedApiConsumers.length > 0) {
          <section class="cross-hub__section" aria-labelledby="consumers-heading">
            <div class="demo-card demo-card--stack cross-hub__consumers-card">
              <p class="demo-eyebrow">Shared API consumers</p>
              <h2 id="consumers-heading">Angular packages that consume the .NET SampleApi</h2>
              <p class="demo-card__summary">
                These Angular packages connect to the .NET SampleApi for live HTTP demos. Start the
                API with <code>pnpm dotnet:start:demo-api</code> to enable backend integration.
              </p>
              <div class="demo-link-row">
                @for (consumer of sharedApiConsumers; track consumer.angularId) {
                  <a class="demo-link-chip" [routerLink]="'/packages/' + consumer.angularId">
                    {{ consumer.angularLabel }}
                  </a>
                }
                <a class="demo-link-chip" routerLink="/dotnet/sample-api">SampleApi Explorer</a>
              </div>
            </div>
          </section>
        }
      </div>
    </demo-stack-hub-layout>
  `,
  styles: [`
    :host { display: block; }
    .cross-hub__lede { max-width: 52rem; }
    .cross-hub__action {
      display: inline-flex; align-items: center; justify-content: center;
      min-height: 3rem; padding: 0.95rem 1.15rem;
      border: 1px solid rgba(13, 73, 82, 0.24); border-radius: 1.05rem;
      background: linear-gradient(180deg, #155e68, #0d4952);
      color: white; font-weight: 700; text-decoration: none;
      box-shadow: var(--shadow-soft);
      transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
    }
    .cross-hub__action:hover, .cross-hub__action:focus-visible {
      transform: translateY(-1px); box-shadow: var(--shadow-medium);
      background: linear-gradient(180deg, #176d76, #0f525a);
    }
    .cross-hub__section { display: grid; gap: 1.15rem; }
    .cross-hub__section-heading {
      display: flex; gap: 1rem; align-items: end; justify-content: space-between; flex-wrap: wrap;
    }
    .cross-hub__section-heading h2 {
      margin: 0; color: var(--color-ink);
      font-size: clamp(1.45rem, 2.2vw, 2rem); line-height: 1.05; letter-spacing: -0.04em;
    }
    .cross-hub__section-heading p { max-width: 42rem; }
    .cross-hub__grid {
      display: grid; gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr));
    }
    .cross-hub__consumers-card {
      background: rgba(248, 252, 251, 0.72);
      border-color: rgba(13, 73, 82, 0.14);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrossStackHubPageComponent {
  readonly crossStackEntries = getUnifiedPackages().filter((p) => p.scope === 'Cross-stack');
  readonly sharedApiConsumers = SITE_SHARED_API_CONSUMERS;
}
