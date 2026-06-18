import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { UnifiedPackageEntry } from '../../../site-catalog';
import { STACK_REGISTRY } from '../../../site-catalog';

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
          [class.site-status-badge--released]="entry().status === 'Released'"
          [class.site-status-badge--in-progress]="entry().status === 'In Progress'"
          [class.site-status-badge--muted]="entry().status === 'Planned' || entry().status === 'Proposed'"
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

      @if (entry().dependencies.length > 0) {
        <div class="package-card__dependencies">
          @for (dep of entry().dependencies; track dep.packageId) {
            <p class="package-card__dependency">
              <span class="demo-hint-pill package-card__dep-pill">
                {{ dep.relationship }}
              </span>
              <span class="package-card__dep-label">{{ dep.label }}</span>
              @if (dep.route) {
                <a class="demo-link-chip" [routerLink]="dep.route">Open hub</a>
              }
            </p>
          }
        </div>
      }

      <div class="package-card__footer">
        <div class="package-card__meta">
          <span class="demo-hint-pill"
            >{{ entry().demoCount }} live demo{{ entry().demoCount !== 1 ? 's' : '' }}</span
          >
        </div>

        <div class="demo-link-row package-card__links">
          <a class="package-card__action" [routerLink]="entry().route"
            >Open {{ scopeLabel() }} hub</a
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
    return STACK_REGISTRY[scope]?.packageLabel ?? scope;
  };
}
