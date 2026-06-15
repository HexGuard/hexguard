import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { SitePackageCatalogEntry } from '../../site-catalog';

@Component({
  selector: 'demo-package-hub-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="package-hub" [attr.data-testid]="overviewTestId()">
      <article class="demo-card demo-card--stack package-hub__overview">
        <div class="package-hub__header">
          <div>
            <p class="demo-eyebrow">{{ packageEntry().scope }} package hub</p>
            <h2>{{ packageEntry().packageName }}</h2>
          </div>

          <div class="package-hub__header-meta">
            <span class="site-status-badge">{{ packageEntry().status }}</span>
            <span class="demo-hint-pill">{{ packageEntry().demoCount }} live demos</span>
          </div>
        </div>

        <p class="demo-card__summary">{{ packageEntry().summary }}</p>
        <p class="package-hub__detail">{{ packageEntry().detail }}</p>

        <div class="demo-link-row">
          <a
            class="demo-link-chip"
            [href]="packageEntry().docsLinks[0]?.href"
            target="_blank"
            rel="noreferrer"
          >
            Package README
          </a>
          <a
            class="demo-link-chip"
            [href]="packageEntry().docsLinks[1]?.href"
            target="_blank"
            rel="noreferrer"
          >
            Deep package notes
          </a>
          <a
            class="demo-link-chip"
            [href]="packageEntry().repositoryHref"
            target="_blank"
            rel="noreferrer"
          >
            Package source
          </a>
        </div>
      </article>

      <section class="package-hub__reference-grid">
        <article
          class="demo-card demo-card--stack"
          [attr.data-testid]="overviewTestId() + '-quick-start'"
        >
          <div>
            <p class="demo-eyebrow">Quick start</p>
            <h3>Install and inspect the contract locally</h3>
          </div>

          <pre
            class="demo-code-block package-hub__install-block"
          ><code>{{ packageEntry().installCommand }}</code></pre>

          <p class="demo-card__summary">
            Start with the package README for API details, then use the deep notes and live demos to
            inspect behavior with the real component source visible in the inspector.
          </p>
        </article>

        <article
          class="demo-card demo-card--stack"
          [attr.data-testid]="overviewTestId() + '-best-fit'"
        >
          <div>
            <p class="demo-eyebrow">Best fit</p>
            <h3>Where this package earns its keep</h3>
          </div>

          <ul class="package-hub__scenario-list" aria-label="Best fit scenarios">
            @for (scenario of packageEntry().bestFitScenarios; track scenario) {
              <li>{{ scenario }}</li>
            }
          </ul>
        </article>
      </section>

      <section class="package-hub__info-grid">
        <article
          class="demo-card demo-card--stack"
          [attr.data-testid]="overviewTestId() + '-highlights'"
        >
          <div>
            <p class="demo-eyebrow">What it covers</p>
            <h3>Production scenarios, not toy examples</h3>
          </div>

          <ul class="package-hub__highlights" aria-label="Package highlights">
            @for (highlight of packageEntry().featureHighlights; track highlight) {
              <li>{{ highlight }}</li>
            }
          </ul>
        </article>

        <article
          class="demo-card demo-card--stack"
          [attr.data-testid]="overviewTestId() + '-docs-stack'"
        >
          <div>
            <p class="demo-eyebrow">Docs and source</p>
            <h3>Move between code, docs, and live routes</h3>
          </div>

          <p class="demo-card__summary">
            Use the package README for API details, the deep docs for behavior notes, and the demo
            routes for runnable workflows backed by the same repository source.
          </p>

          <p class="package-hub__detail">
            Every demo route keeps the live state panel and full component source viewer wired to
            the same package-specific documentation links.
          </p>

          <div class="demo-link-row">
            <a
              class="demo-link-chip"
              [href]="packageEntry().repositoryHref"
              target="_blank"
              rel="noreferrer"
            >
              Package source
            </a>

            @for (link of packageEntry().docsLinks; track link.href) {
              <a class="demo-link-chip" [href]="link.href" target="_blank" rel="noreferrer">
                {{ link.label }}
              </a>
            }
          </div>
        </article>
      </section>

      <section class="package-hub__narrative-grid">
        <article
          class="demo-card demo-card--stack"
          [attr.data-testid]="overviewTestId() + '-status-notes'"
        >
          <div>
            <p class="demo-eyebrow">Status and trajectory</p>
            <h3>How this package fits the current HexGuard surface</h3>
          </div>

          <div class="package-hub__paragraphs">
            @for (paragraph of packageEntry().statusNoteParagraphs; track paragraph) {
              <p class="demo-card__summary">{{ paragraph }}</p>
            }
          </div>
        </article>
      </section>

      <section class="package-hub__demos" aria-label="Package demos">
        <div class="package-hub__demos-heading">
          <div>
            <p class="demo-eyebrow">Live workflows</p>
            <h3>{{ packageEntry().demoCount }} demos linked to the package hub</h3>
          </div>

          <p class="demo-card__summary">
            Each demo route keeps the live state panel, the source inspector, and the current docs
            links tied to the package metadata.
          </p>
        </div>

        <div class="package-hub__demos-grid">
          @for (demo of packageEntry().demoPackage.demos; track demo.route) {
            <a
              class="demo-card demo-card--nav package-hub__demo-card"
              [routerLink]="demo.route"
              [attr.data-testid]="demoTestIdPrefix() + demo.id"
            >
              <p class="demo-eyebrow">{{ packageEntry().packageName }}</p>
              <h3>{{ demo.label }}</h3>
              <p class="package-hub__demo-description">{{ demo.description }}</p>
              <span class="package-hub__demo-meta">{{ demoMeta() }}</span>
            </a>
          }
        </div>
      </section>
    </section>
  `,
  styleUrl: './package-hub-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackageHubPageComponent {
  readonly packageEntry = input.required<SitePackageCatalogEntry>();
  readonly overviewTestId = input.required<string>();
  readonly demoTestIdPrefix = input.required<string>();
  readonly demoMeta = computed(() => {
    switch (this.packageEntry().id) {
      case 'angular-url-state':
        return 'URL-backed workflow, generated source panel, and docs links';
      case 'angular-query-form':
        return 'Reactive Forms flow, generated source panel, and docs links';
      case 'angular-async-state':
        return 'Lifecycle state flow, generated source panel, and docs links';
      case 'angular-permissions':
        return 'Permission context flow, generated source panel, and docs links';
      default:
        return 'Live workflow, generated source panel, and docs links';
    }
  });
}
