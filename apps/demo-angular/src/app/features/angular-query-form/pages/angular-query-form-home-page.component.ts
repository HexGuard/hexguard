import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ANGULAR_QUERY_FORM_PACKAGE } from '../../../demo-registry';

@Component({
  standalone: true,
  selector: 'demo-angular-query-form-home-page',
  imports: [RouterLink],
  template: `
    <section class="package-overview" data-testid="package-angular-query-form">
      <article class="demo-card demo-card--stack package-overview__intro">
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Angular package showcase</p>
            <h2>{{ packageEntry.title }}</h2>
          </div>
          <span class="demo-hint-pill">{{ packageEntry.demos.length }} demos</span>
        </div>

        <p class="demo-card__summary">{{ packageEntry.description }}</p>

        <div class="demo-link-row">
          @for (link of packageEntry.docsLinks; track link.href) {
            <a class="demo-link-chip" [href]="link.href" target="_blank" rel="noreferrer">
              {{ link.label }}
            </a>
          }
        </div>
      </article>

      <section class="package-overview__grid" aria-label="Package demos">
        @for (demo of packageEntry.demos; track demo.route) {
          <a
            class="demo-card demo-card--nav"
            [routerLink]="demo.route"
            [attr.data-testid]="'package-query-form-demo-' + demo.id"
          >
            <p class="demo-eyebrow">{{ packageEntry.label }}</p>
            <h3>{{ demo.label }}</h3>
            <p class="package-overview__description">{{ demo.description }}</p>
            <span class="package-overview__meta"
              >Reactive Forms binding, generated source panel, and docs links</span
            >
          </a>
        }
      </section>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .package-overview {
        display: grid;
        gap: 1.25rem;
      }

      .package-overview__grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
      }

      .package-overview__description,
      .package-overview__meta {
        color: var(--color-muted);
      }

      .package-overview__meta {
        font-size: 0.9rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularQueryFormHomePageComponent {
  readonly packageEntry = ANGULAR_QUERY_FORM_PACKAGE;
}
