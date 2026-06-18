import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DemoPageLayoutComponent } from '../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../shared/components/demo-status-strip.component';
import { DOTNET_BULK_OPERATIONS_HOME } from '../../../../demo-registry';

@Component({
  standalone: true,
  selector: 'demo-bulk-operations-demo-page',
  imports: [DemoPageLayoutComponent, DemoStatusStripComponent],
  template: `
    <demo-page-layout testId="bulk-operations-demo-page">
      <article demoIntro class="demo-card demo-card--stack">
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">HexGuard.BulkOperations</p>
            <h2>HTTP 207 Multi-Status bulk action contracts.</h2>
          </div>
        </div>
        <p class="demo-card__summary">
          The <code>HexGuard.BulkOperations</code> library provides typed request/response
          contracts, a <code>BulkOperationResultBuilder</code> for aggregating per-item results, and
          <code>Results.Extensions.BulkOperation()</code> for Minimal API integration.
        </p>

        <demo-status-strip
          testId="bulk-operations-demo-status"
          summary="Bulk operation contracts and result builder for .NET."
          currentUrl="Bulk Operations .NET Demo"
          summaryTestId="bulk-operations-demo-summary"
          urlTestId="bulk-operations-demo-url"
        />
      </article>

      <article demoPrimary class="demo-card demo-card--stack">
        <div>
          <p class="demo-eyebrow">API Endpoints</p>
          <h3>Available endpoints in the shared SampleApi</h3>
        </div>

        <p class="demo-card__summary">
          Start the shared SampleApi with <code>pnpm dotnet:start:demo-api</code>, then test these
          endpoints:
        </p>

        <pre class="demo-code-block"><code>POST /api/bulk-operations/delete
POST /api/bulk-operations/approve
POST /api/bulk-operations/update-status</code></pre>

        <h4 style="margin-top: 1.25rem;">Request shape</h4>
        <pre class="demo-code-block"><code>{{ '{' }}
  "items": [
    {{ '{' }} "id": "ord-001", "name": "Widget A", "status": "pending" {{ '}' }},
    {{ '{' }} "id": "ord-003", "name": "Widget C", "status": "shipped" {{ '}' }}
  ]
{{ '}' }}</code></pre>

        <h4 style="margin-top: 1.25rem;">Response shape (207 Multi-Status)</h4>
        <pre class="demo-code-block"><code>{{ '{' }}
  "status": "PartialFailure",
  "totalCount": 2,
  "successCount": 1,
  "failureCount": 1,
  "results": [
    {{ '{' }} "item": {{ '{' }} "id": "ord-001", ... {{ '}' }}, "succeeded": true {{ '}' }},
    {{ '{' }} "item": {{ '{' }} "id": "ord-003", ... {{ '}' }}, "succeeded": false,
      "error": {{ '{' }} "code": "CANNOT_DELETE", "message": "Order has already been shipped" {{ '}' }} {{ '}' }}
  ]
{{ '}' }}</code></pre>

        <p class="demo-card__summary" style="margin-top: 1rem;">
          The <code>BulkOperationResultBuilder</code> automatically computes the aggregate status:
          <strong>Completed</strong> (all success), <strong>PartialFailure</strong> (mixed), or
          <strong>Failed</strong> (all failure). Use
          <code>Results.Extensions.BulkOperation()</code> to produce the correct HTTP status code
          with the response body.
        </p>
      </article>
    </demo-page-layout>
  `,
  styles: [
    `
      pre {
        white-space: pre-wrap;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DotnetBulkOperationsDemoPageComponent {
  readonly demo = DOTNET_BULK_OPERATIONS_HOME;
}
