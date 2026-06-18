import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PackageCardComponent } from '../../../shared/components/package-card/package-card.component';
import { StackHubLayoutComponent } from '../../../shared/components/stack-hub-layout/stack-hub-layout.component';
import { getUnifiedPackages, SECTION_COLLAPSED_LIMIT } from '../../../site-catalog';

@Component({
  standalone: true,
  selector: 'demo-angular-hub-page',
  imports: [PackageCardComponent, RouterLink, StackHubLayoutComponent],
  template: `
    <demo-stack-hub-layout testId="angular-hub-page">
      <div heroContent>
        <p class="demo-eyebrow">Angular packages</p>
        <h2>Angular guardrail libraries with live demos</h2>
        <p class="demo-card__summary angular-hub__lede">
          Seven Angular packages covering URL state, async lifecycle, form binding, lookup caching,
          optimistic updates, permission gating, and API error handling — each with dedicated
          package hubs, runnable demo pages, and Playwright-backed coverage.
        </p>
        <div class="demo-link-row">
          <a class="angular-hub__action" routerLink="/dotnet">Explore .NET packages</a>
          <a class="angular-hub__action" routerLink="/cross-stack">View cross-stack pairs</a>
        </div>
      </div>

      <div sections>
        <section class="stack-hub__section" aria-labelledby="angular-packages-heading">
          <div class="stack-hub__section-heading">
            <div>
              <p class="demo-eyebrow">Available packages</p>
              <h2 id="angular-packages-heading">{{ angularPackages.length }} Angular packages</h2>
            </div>
            <p class="demo-card__summary">
              Each card links to a dedicated package hub with docs, source, and demo routes.
            </p>
          </div>

          <div class="stack-hub__grid">
            @for (entry of displayed(); track entry.id) {
              <demo-package-card [entry]="entry" />
            }
          </div>

          @if (angularPackages.length > sectionCollapsedLimit) {
            <button
              class="stack-hub__expand-toggle"
              type="button"
              (click)="showAll.set(!showAll())"
              [attr.data-testid]="'angular-hub-expand-toggle'"
            >
              {{
                showAll()
                  ? 'Show fewer packages'
                  : 'Show all ' + angularPackages.length + ' Angular packages'
              }}
            </button>
          }
        </section>
      </div>
    </demo-stack-hub-layout>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .angular-hub__lede {
        max-width: 52rem;
      }
      .angular-hub__action {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 3rem;
        padding: 0.95rem 1.15rem;
        border: 1px solid rgba(13, 73, 82, 0.24);
        border-radius: 1.05rem;
        background: linear-gradient(180deg, #155e68, #0d4952);
        color: white;
        font-weight: 700;
        text-decoration: none;
        box-shadow: var(--shadow-soft);
        transition:
          transform 180ms ease,
          box-shadow 180ms ease,
          background 180ms ease;
      }
      .angular-hub__action:hover,
      .angular-hub__action:focus-visible {
        transform: translateY(-1px);
        box-shadow: var(--shadow-medium);
        background: linear-gradient(180deg, #176d76, #0f525a);
      }
      .stack-hub__section {
        display: grid;
        gap: 1.15rem;
      }
      .stack-hub__section-heading {
        display: flex;
        gap: 1rem;
        align-items: end;
        justify-content: space-between;
        flex-wrap: wrap;
      }
      .stack-hub__section-heading h2 {
        margin: 0;
        color: var(--color-ink);
        font-size: clamp(1.45rem, 2.2vw, 2rem);
        line-height: 1.05;
        letter-spacing: -0.04em;
      }
      .stack-hub__section-heading p {
        max-width: 42rem;
      }
      .stack-hub__grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr));
      }
      .stack-hub__expand-toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        justify-self: start;
        min-height: 2.6rem;
        padding: 0.6rem 1rem;
        border: 1px solid var(--color-accent-border);
        border-radius: var(--radius-pill);
        background: var(--color-surface-strong);
        color: var(--color-accent-strong);
        font-family: var(--font-mono);
        font-size: 0.82rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        cursor: pointer;
        box-shadow: var(--surface-glow), var(--shadow-soft);
        transition:
          transform 150ms ease,
          border-color 150ms ease,
          box-shadow 150ms ease;
      }
      .stack-hub__expand-toggle:hover,
      .stack-hub__expand-toggle:focus-visible {
        transform: translateY(-1px);
        border-color: var(--color-accent-border-strong);
        box-shadow: var(--surface-glow), var(--shadow-medium);
      }
      @media (max-width: 720px) {
        .stack-hub__expand-toggle {
          width: 100%;
          justify-self: stretch;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularHubPageComponent {
  readonly angularPackages = getUnifiedPackages().filter((p) => p.scope === 'Angular');
  readonly sectionCollapsedLimit = SECTION_COLLAPSED_LIMIT;
  readonly showAll = signal(false);

  protected readonly displayed = () =>
    this.showAll()
      ? this.angularPackages
      : this.angularPackages.slice(0, this.sectionCollapsedLimit);
}
