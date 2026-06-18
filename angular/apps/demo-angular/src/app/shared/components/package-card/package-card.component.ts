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

      <div class="package-card__body">
        <p class="demo-card__summary">{{ entry().summary }}</p>

        @if (entry().featureHighlights.length > 0) {
          <ul class="package-card__highlights" aria-label="Package highlights">
            @for (highlight of entry().featureHighlights.slice(0, 3); track highlight) {
              <li>{{ highlight }}</li>
            }
            @if (entry().featureHighlights.length > 3) {
              <li class="package-card__highlights-more"
                >+{{ entry().featureHighlights.length - 3 }} more</li
              >
            }
          </ul>
        }
      </div>

      @if (entry().dependencies.length > 0) {
        <div class="package-card__dep-bar">
          @for (dep of entry().dependencies; track dep.packageId) {
            @if (dep.route) {
              <a
                class="package-card__dep-btn"
                [routerLink]="dep.route"
                [attr.title]="dep.relationship + ': ' + dep.label"
              >
                <svg
                  class="package-card__dep-icon"
                  viewBox="0 0 16 16"
                  fill="none"
                  width="10"
                  height="10"
                  aria-hidden="true"
                >
                  <path
                    d="M8 3L13 8L8 13"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M13 8H3"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
                <span class="package-card__dep-label">{{ dep.label }}</span>
              </a>
            }
          }
        </div>
      }

      <div class="package-card__footer">
        <span class="demo-hint-pill package-card__demo-count"
          >{{ entry().demoCount }} demo{{ entry().demoCount !== 1 ? 's' : '' }}</span
        >

        <div class="package-card__actions">
          <a
            class="package-card__action-btn package-card__action-btn--primary"
            [routerLink]="entry().route"
            [attr.title]="'Open ' + scopeLabel() + ' hub'"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              width="13"
              height="13"
              aria-hidden="true"
            >
              <path
                d="M6 3L11 8L6 13"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>Hub</span>
          </a>

          @if (entry().repositoryHref) {
            <a
              class="package-card__action-btn"
              [href]="entry().repositoryHref"
              target="_blank"
              rel="noreferrer"
              title="View source"
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                width="13"
                height="13"
                aria-hidden="true"
              >
                <path
                  d="M5.5 5.5L9 8L5.5 10.5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9 3H12C12.5523 3 13 3.44772 13 4V12C13 12.5523 12.5523 13 12 13H9"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
              <span>Source</span>
            </a>
          }

          @if (entry().docsLinks.length > 0) {
            <a
              class="package-card__action-btn"
              [href]="entry().docsLinks[0].href"
              target="_blank"
              rel="noreferrer"
              title="Package docs"
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                width="13"
                height="13"
                aria-hidden="true"
              >
                <path
                  d="M2 4C2 3.44772 2.44772 3 3 3H13C13.5523 3 14 3.44772 14 4V12C14 12.5523 13.5523 13 13 13H3C2.44772 13 2 12.5523 2 12V4Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M5 7H11"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M5 10H9"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
              <span>Docs</span>
            </a>
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
