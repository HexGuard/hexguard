import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-angular-selection-state-home-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>Angular Selection State</h1>
    <p>Headless keyed selection state for Angular tables, lists, and bulk-action flows.</p>

    <section class="demo-links">
      <a
        routerLink="/packages/angular-selection-state/demo"
        class="demo-link"
        data-testid="selection-state-demo-link"
      >
        <h2>Demo: Table Selection</h2>
        <p>Mock data table with checkbox column, select-all header, and bulk action bar.</p>
      </a>
    </section>
  `,
  styles: [
    `
      .demo-links {
        display: grid;
        gap: 1rem;
        padding: 1rem 2rem;
      }
      .demo-link {
        display: block;
        padding: 1rem;
        border: 1px solid var(--border-color, #ccc);
        border-radius: 0.5rem;
        text-decoration: none;
        color: inherit;
      }
      .demo-link:hover {
        background: var(--hover-bg, #f5f5f5);
      }
    `,
  ],
})
export class AngularSelectionStateHomePageComponent {}
