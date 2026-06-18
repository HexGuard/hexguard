import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { UnifiedPackageEntry } from '../../../site-catalog';

@Component({
  selector: 'demo-package-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <article
      class="demo-card demo-card--stack package-card"
      [attr.data-testid]="'package-card-' + entry().id"
    >
      <div class="package-card__header">
        <div class="package-card__title">
          <p class="demo-eyebrow">{{ scopeLabel() }}</p>
          <h3>{{ entry().packageName }}</h3>
        </div>
        <span
          class="site-status-badge package-card__status"
          [attr.data-testid]="'package-card-status-' + entry().id"
          >{{ entry().status }}</span
        >
      </div>

      <p class="demo-card__summary">{{ entry().summary }}</p>

      @if (entry().detail; as detail) {
        <p class="package-card__detail">{{ detail }}</p>
      }

      @if (entry().featureHighlights.length > 0) {
        <ul class="package-card__highlights" aria-label="Package highlights">
          @for (highlight of entry().featureHighlights; track highlight) {
            <li>{{ highlight }}</li>
          }
        </ul>
      }

      @if (entry().counterpartLabel; as counterpart) {
        <p class="package-card__counterpart">
          <span class="demo-hint-pill package-card__counterpart-pill">
            {{ counterpartScope() }} counterpart: {{ counterpart }}
          </span>
          @if (entry().counterpartRoute; as route) {
            <a class="demo-link-chip" [routerLink]="route">Open {{ counterpartScope() }} hub</a>
          }
        </p>
      }

      <div class="package-card__footer">
        <div class="package-card__meta">
          <span class="demo-hint-pill"
            >{{ entry().demoCount }} live demo{{ entry().demoCount !== 1 ? 's' : '' }}</span
          >
        </div>

        <div class="demo-link-row package-card__links">
          <a class="package-card__action" [routerLink]="entry().route"
            >Open {{ entry().scope }} hub</a
          >

          @if (entry().repositoryHref) {
            <a
              class="demo-link-chip"
              [href]="entry().repositoryHref"
              target="_blank"
              rel="noreferrer"
              >View source</a
            >
          }

          @if (entry().docsLinks.length > 0) {
            <a
              class="demo-link-chip"
              [href]="entry().docsLinks[0].href"
              target="_blank"
              rel="noreferrer"
              >Package docs</a
            >
          }
        </div>
      </div>
    </article>
  `,
  styleUrl: './package-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackageCardComponent {
  readonly entry = input.required<UnifiedPackageEntry>();

  protected readonly scopeLabel = () => {
    const scope = this.entry().scope;
    switch (scope) {
      case 'Angular':
        return 'Angular';
      case '.NET':
        return 'NuGet';
      case 'Cross-stack':
        return 'Cross-stack';
    }
  };

  protected readonly counterpartScope = () => {
    const scope = this.entry().scope;
    switch (scope) {
      case 'Angular':
        return '.NET';
      case '.NET':
        return 'Angular';
      case 'Cross-stack':
        return '.NET';
    }
  };
}
