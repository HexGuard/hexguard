import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { DotnetSitePackageCatalogEntry } from '../../../site-catalog';

@Component({
  selector: 'demo-dotnet-package-hub-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="dotnet-pkg-hub" [attr.data-testid]="overviewTestId()">
      <article class="demo-card demo-card--stack dotnet-pkg-hub__overview">
        <div class="dotnet-pkg-hub__header">
          <div class="dotnet-pkg-hub__header-copy">
            <p class="demo-eyebrow">NuGet package hub</p>
            <h2>{{ entry().packageName }}</h2>
          </div>
          <div class="dotnet-pkg-hub__header-meta">
            <span class="site-status-badge">{{ entry().status }}</span>
            <span class="demo-hint-pill"
              >{{ entry().demoCount }} live demo{{ entry().demoCount !== 1 ? 's' : '' }}</span
            >
          </div>
        </div>

        <p class="demo-card__summary">{{ entry().summary }}</p>

        @if (entry().dependencies.length > 0) {
          <div class="dotnet-pkg-hub__dependencies">
            @for (dep of entry().dependencies; track dep.packageId) {
              <p class="dotnet-pkg-hub__dependency">
                <span class="demo-hint-pill dotnet-pkg-hub__dep-pill">
                  {{ dep.relationship }}
                </span>
                <span class="dotnet-pkg-hub__dep-label">{{ dep.label }}</span>
                @if (dep.route) {
                  <a class="demo-link-chip" [routerLink]="dep.route">Open hub</a>
                }
              </p>
            }
          </div>
        }

        <div class="demo-link-row dotnet-pkg-hub__overview-links">
          @for (link of entry().dotnetPackage.docsLinks; track link.href) {
            <a class="demo-link-chip" [href]="link.href" target="_blank" rel="noreferrer">{{
              link.label
            }}</a>
          }
        </div>
      </article>

      <section class="dotnet-pkg-hub__demos" aria-label="Package demos">
        <div class="dotnet-pkg-hub__demos-heading">
          <div>
            <p class="demo-eyebrow">Live demos</p>
            <h3>
              {{ entry().demoCount }} demo{{ entry().demoCount !== 1 ? 's' : '' }} for this package
            </h3>
          </div>
          <p class="demo-card__summary">
            Each demo route keeps the live state panel and source inspector wired to the package
            documentation links.
          </p>
        </div>

        <div class="dotnet-pkg-hub__demos-grid">
          @for (demo of entry().dotnetPackage.demos; track demo.route) {
            <a
              class="demo-card demo-card--nav dotnet-pkg-hub__demo-card"
              [routerLink]="demo.route"
              [attr.data-testid]="demoTestIdPrefix() + demo.id"
            >
              <p class="demo-eyebrow">{{ entry().packageName }}</p>
              <h3>{{ demo.label }}</h3>
              <p class="dotnet-pkg-hub__demo-description">{{ demo.description }}</p>
            </a>
          }
        </div>
      </section>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .dotnet-pkg-hub {
        display: grid;
        gap: 1.6rem;
      }
      .dotnet-pkg-hub__overview {
        background:
          radial-gradient(circle at top right, rgba(20, 101, 111, 0.18), transparent 28%),
          radial-gradient(circle at bottom left, rgba(217, 119, 75, 0.1), transparent 24%),
          linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(247, 240, 231, 0.82));
      }
      .dotnet-pkg-hub__header,
      .dotnet-pkg-hub__demos-heading {
        display: flex;
        gap: 1rem 1.25rem;
        align-items: end;
        justify-content: space-between;
        flex-wrap: wrap;
      }
      .dotnet-pkg-hub__header {
        align-items: start;
      }
      .dotnet-pkg-hub__header-copy {
        display: grid;
        gap: 0.35rem;
        min-width: 0;
        flex: 1 1 18rem;
      }
      .dotnet-pkg-hub__header h2,
      .dotnet-pkg-hub__demos-heading h3,
      .dotnet-pkg-hub__demo-card h3 {
        margin: 0;
        color: var(--color-ink);
      }
      .dotnet-pkg-hub__header h2,
      .dotnet-pkg-hub__demos-heading h3 {
        line-height: 1.05;
        letter-spacing: -0.04em;
      }
      .dotnet-pkg-hub__header-meta {
        display: flex;
        gap: 0.8rem;
        align-items: start;
        flex-wrap: wrap;
        min-width: 0;
      }
      .dotnet-pkg-hub__dependencies {
        display: grid;
        gap: 0.35rem;
      }
      .dotnet-pkg-hub__dependency {
        display: flex;
        gap: 0.6rem;
        align-items: center;
        flex-wrap: wrap;
        margin: 0;
      }
      .dotnet-pkg-hub__dep-pill {
        background: rgba(13, 73, 82, 0.08);
        border-color: rgba(13, 73, 82, 0.24);
        color: var(--color-accent-strong);
        font-size: 0.68rem;
      }
      .dotnet-pkg-hub__dep-label {
        color: var(--color-muted);
        font-size: 0.82rem;
      }
      .dotnet-pkg-hub__demos {
        display: grid;
        gap: 1rem;
      }
      .dotnet-pkg-hub__demos-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr));
      }
      .dotnet-pkg-hub__demo-card {
        height: 100%;
        align-content: start;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(247, 240, 231, 0.8));
      }
      .dotnet-pkg-hub__demo-description {
        margin: 0;
        color: var(--color-muted);
        line-height: 1.55;
      }
      .dotnet-pkg-hub__overview-links {
        width: 100%;
      }
      .dotnet-pkg-hub__overview-links > * {
        flex: 1 1 12rem;
        justify-content: center;
      }
      @media (max-width: 900px) {
        .dotnet-pkg-hub__overview-links > * {
          flex-basis: 14rem;
        }
      }
      @media (max-width: 720px) {
        .dotnet-pkg-hub__overview-links > * {
          flex-basis: 100%;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DotnetPackageHubPageComponent {
  readonly entry = input.required<DotnetSitePackageCatalogEntry>();
  readonly overviewTestId = input.required<string>();
  readonly demoTestIdPrefix = input.required<string>();
}
