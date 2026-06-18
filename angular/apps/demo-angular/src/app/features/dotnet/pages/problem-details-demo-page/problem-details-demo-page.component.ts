import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DemoInspectorPanelComponent } from '../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../shared/components/demo-status-strip.component';
import { createTrackedCurrentUrl } from '../../../../shared/current-url.signal';
import { DOTNET_PROBLEM_DETAILS_HOME, getDotnetPackage } from '../../../../demo-registry';
import type { DemoPageEntry } from '../../../../demo-registry';
import { formatSnapshot } from '../../../../shared/formatting';

const API_BASE = 'http://127.0.0.1:5074';

interface ProblemDetailsEndpoint {
  readonly id: string;
  readonly label: string;
  readonly url: string;
  readonly description: string;
  readonly expectedStatus: number;
}

@Component({
  standalone: true,
  selector: 'demo-problem-details-page',
  imports: [
    DemoPageLayoutComponent,
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoStatusStripComponent,
  ],
  template: `
    <demo-page-layout testId="problem-details-demo-page">
      <demo-navigation-strip
        demoNavigation
        testId="problem-details-demo-navigation"
        [demo]="dummyDemoEntry"
      />

      <article demoIntro class="demo-card demo-card--stack">
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">HexGuard.ProblemDetails</p>
            <h2>RFC 9457 Problem Details — endpoint demos</h2>
          </div>
        </div>
        <p class="demo-card__summary">
          The <code>HexGuard.ProblemDetails</code> package produces RFC 9457 JSON responses through
          the shared <code>HexGuard.SampleApi</code>. Click an endpoint below to fetch and inspect
          the response.
        </p>

        <demo-status-strip
          testId="problem-details-demo-status"
          [summary]="dotnetDemo.description"
          [currentUrl]="currentUrl()"
          summaryTestId="problem-details-demo-summary"
          urlTestId="problem-details-demo-url"
        />
      </article>

      <article demoPrimary class="demo-card demo-card--stack">
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Endpoints</p>
            <h3>{{ endpoints.length }} demo endpoints</h3>
          </div>
        </div>

        @if (isBusy()) {
          <p class="demo-card__summary">Loading…</p>
        }

        @for (ep of endpoints; track ep.id) {
          <div class="pd-endpoint">
            <div class="pd-endpoint__head">
              <span class="pd-endpoint__method">GET</span>
              <code class="pd-endpoint__path">{{ ep.url }}</code>
            </div>
            <p class="demo-card__summary">{{ ep.description }}</p>
            <button
              type="button"
              class="pd-endpoint__button"
              (click)="fetchEndpoint(ep)"
              [attr.data-testid]="'pd-fetch-' + ep.id"
            >
              {{ lastScenario() === ep.id ? 'Fetch again' : 'Fetch' }}
            </button>
          </div>
        }

        @if (responseJson(); as json) {
          <div class="pd-response">
            <div class="pd-response__head">
              <span class="demo-eyebrow">Response</span>
              <span
                class="pd-response__status"
                [class.pd-response__status--ok]="lastStatus() < 400"
              >
                {{ lastStatus() }}
              </span>
            </div>
            <pre class="pd-response__json">{{ json }}</pre>
          </div>
        }

        @if (error(); as err) {
          <div class="pd-response pd-response--error">
            <p class="demo-eyebrow">Error</p>
            <p>{{ err }}</p>
          </div>
        }
      </article>

      <demo-inspector-panel
        demoAside
        panelTestId="problem-details-inspector-panel"
        eyebrow="Reference"
        title="Problem Details state"
        [snapshotJson]="snapshotJson()"
        [snippetId]="''"
        codeTestId="problem-details-code-sample"
        [docsLinks]="dotnetPackage()?.docsLinks ?? []"
        snapshotTestId="problem-details-snapshot-json"
      />
    </demo-page-layout>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .pd-endpoint {
        padding: 0.85rem 1rem;
        border: 1px solid var(--color-border);
        border-radius: 0.85rem;
        background: rgba(255, 255, 255, 0.82);
        display: grid;
        gap: 0.5rem;
      }
      .pd-endpoint + .pd-endpoint {
        margin-top: 0.7rem;
      }
      .pd-endpoint__head {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }
      .pd-endpoint__method {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.15rem 0.45rem;
        border-radius: 0.35rem;
        background: #155e68;
        color: white;
        font-family: var(--font-mono);
        font-size: 0.7rem;
        font-weight: 700;
      }
      .pd-endpoint__path {
        font-size: 0.85rem;
        word-break: break-word;
      }
      .pd-endpoint__button {
        justify-self: start;
        padding: 0.4rem 1rem;
        border: 1px solid var(--color-accent-border);
        border-radius: 0.5rem;
        background: white;
        color: var(--color-accent-strong);
        font-family: var(--font-mono);
        font-size: 0.82rem;
        cursor: pointer;
      }
      .pd-endpoint__button:hover {
        background: var(--color-accent-strong);
        color: white;
      }
      .pd-response {
        margin-top: 1rem;
        padding: 0.85rem 1rem;
        border: 1px solid var(--color-border);
        border-radius: 0.85rem;
        background: rgba(255, 255, 255, 0.82);
      }
      .pd-response--error {
        border-color: #f5c6cb;
        background: #fdf0f2;
      }
      .pd-response__head {
        display: flex;
        gap: 0.6rem;
        align-items: center;
        margin-bottom: 0.5rem;
      }
      .pd-response__status {
        font-family: var(--font-mono);
        font-size: 0.82rem;
        font-weight: 700;
        padding: 0.1rem 0.4rem;
        border-radius: 0.3rem;
        background: #f8d7da;
        color: #721c24;
      }
      .pd-response__status--ok {
        background: #d4edda;
        color: #155724;
      }
      .pd-response__json {
        margin: 0;
        font-size: 0.82rem;
        line-height: 1.55;
        white-space: pre-wrap;
        word-break: break-word;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProblemDetailsDemoPageComponent {
  readonly dotnetDemo = DOTNET_PROBLEM_DETAILS_HOME;
  readonly dotnetPackage = computed(() => getDotnetPackage('hexguard-problem-details'));
  readonly currentUrl = createTrackedCurrentUrl(this.dotnetDemo.route);

  readonly endpoints: ProblemDetailsEndpoint[] = [
    {
      id: 'validation',
      label: 'Validation Error',
      url: `${API_BASE}/api/problem-details/validation`,
      description: 'Returns a 400 validation error with per-field problems in the extensions.',
      expectedStatus: 400,
    },
    {
      id: 'not-found',
      label: 'Not Found',
      url: `${API_BASE}/api/problem-details/not-found`,
      description: 'Returns a 404 with a resource-not-found problem detail.',
      expectedStatus: 404,
    },
    {
      id: 'server-error',
      label: 'Server Error',
      url: `${API_BASE}/api/problem-details/server-error`,
      description: 'Returns a 500 caught by the ProblemDetailsMiddleware.',
      expectedStatus: 500,
    },
  ];

  readonly responseJson = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly isBusy = signal(false);
  readonly lastScenario = signal<string | null>(null);
  readonly lastUrl = signal<string | null>(null);
  readonly lastStatus = signal(0);

  readonly snapshotJson = computed(() =>
    formatSnapshot({
      lastScenario: this.lastScenario(),
      lastStatus: this.lastStatus(),
      lastUrl: this.lastUrl(),
    }),
  );

  readonly dummyDemoEntry: DemoPageEntry = {
    id: 'hexguard-problem-details',
    packageId: 'hexguard-problem-details',
    route: '/dotnet/problem-details',
    legacyRoute: '',
    label: 'Problem Details Library',
    title: 'HexGuard.ProblemDetails',
    description: '',
    docsLinks: [],
    codeSample: { snippetId: '', label: '', description: '' },
  };

  async fetchEndpoint(ep: ProblemDetailsEndpoint): Promise<void> {
    this.isBusy.set(true);
    this.error.set(null);
    this.lastScenario.set(ep.id);
    this.lastUrl.set(ep.url);

    try {
      const res = await fetch(ep.url);
      this.lastStatus.set(res.status);
      const text = await res.text();
      this.responseJson.set(text);
    } catch (e) {
      this.error.set(String(e));
      this.responseJson.set(null);
    } finally {
      this.isBusy.set(false);
    }
  }
}
