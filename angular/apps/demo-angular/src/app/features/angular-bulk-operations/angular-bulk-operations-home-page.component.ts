import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-angular-bulk-operations-home-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>Angular Bulk Operations</h1>
    <p>
      Bulk-action service and facade for Angular with HTTP 207 partial-success support, progress
      tracking, and selection-state composition.
    </p>

    <section class="demo-links">
      <a
        routerLink="/packages/angular-bulk-operations/demo"
        class="demo-link"
        data-testid="bulk-operations-demo-link"
      >
        <h2>Demo: Bulk Delete & Approve</h2>
        <p>
          Mock data table with selection, bulk delete and approve actions, partial-failure display,
          and retry flow.
        </p>
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
export class AngularBulkOperationsHomePageComponent {}
