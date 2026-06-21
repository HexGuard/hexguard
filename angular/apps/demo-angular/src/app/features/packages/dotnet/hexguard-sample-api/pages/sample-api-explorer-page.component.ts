import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { DemoInspectorPanelComponent } from '../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../shared/components/demo-page-layout.component';
import { DOTNET_SAMPLE_API_EXPLORER, getDotnetPackage } from '../../../../../demo-registry';
import type { DemoPageEntry } from '../../../../../demo-registry';

const DEFAULT_API_BASE = 'http://127.0.0.1:5074';

@Component({
  standalone: true,
  selector: 'demo-sample-api-explorer-page',
  imports: [DemoPageLayoutComponent, DemoInspectorPanelComponent, DemoNavigationStripComponent],
  template: `
    <demo-page-layout testId="sample-api-explorer">
      <demo-navigation-strip
        [demo]="dummyDemoEntry"
        testId="explorer-nav"
        [dotnetPackage]="dotnetPackage()"
        [dotnetDemo]="dotnetDemo"
        demoNavigation
      />

      <div demoIntro>
        <div class="explorer" data-testid="sample-api-explorer-page">
          <article class="demo-card demo-card--stack">
            <p class="demo-eyebrow">HexGuard.SampleApi</p>
            <h2>Shared .NET API endpoint explorer</h2>
            <p class="demo-card__summary">
              Discover and invoke every endpoint group registered in the running
              <code>HexGuard.SampleApi</code>. Start the API with
              <code>pnpm dotnet:start:demo-api</code> then click "Discover endpoints" below.
            </p>
          </article>

          <div class="explorer__toolbar">
            <input
              class="demo-input"
              style="max-width:22rem"
              [value]="apiBase()"
              (input)="updateApiBase($event)"
              placeholder="API base URL"
              data-testid="explorer-api-input"
            />
            <button
              class="demo-button"
              (click)="discoverEndpoints()"
              data-testid="explorer-discover-btn"
              [disabled]="isBusy()"
            >
              {{ hasDiscovered() ? 'Refresh endpoints' : 'Discover endpoints' }}
            </button>
            @if (statusText(); as status) {
              <span class="demo-hint-pill">{{ status }}</span>
            }
          </div>

          @if (error()) {
            <div class="demo-banner demo-banner--error" data-testid="explorer-error">
              {{ error() }}
            </div>
          }
        </div>
      </div>

      <div demoPrimary>
        @if (discoveryResult(); as result) {
          <div class="explorer__package-grid">
            @for (pkg of result.packages; track pkg.id) {
              <article
                class="demo-card demo-card--stack explorer__package-card"
                [attr.data-testid]="'explorer-package-' + pkg.id"
              >
                <div>
                  <p class="demo-eyebrow">{{ pkg.id }}</p>
                  <h3>
                    {{
                      pkg.id === 'hexguard-reference-data'
                        ? '.NET-only library demo'
                        : 'Angular package demo'
                    }}
                  </h3>
                </div>

                <div class="explorer__endpoint-row">
                  <span class="explorer__method-badge explorer__method-badge--get">GET</span>
                  <code>{{ pkg.route }}</code>
                  <button
                    class="demo-link-chip"
                    (click)="callEndpoint(pkg.route)"
                    [attr.data-testid]="'explorer-call-' + pkg.id"
                  >
                    Try it
                  </button>
                </div>

                @if (pkg.catalogEndpoint) {
                  <div class="explorer__endpoint-row">
                    <span class="explorer__method-badge explorer__method-badge--get">GET</span>
                    <code>{{ pkg.catalogEndpoint }}</code>
                    <button class="demo-link-chip" (click)="callEndpoint(pkg.catalogEndpoint)">
                      Try it
                    </button>
                  </div>
                }
              </article>
            }
          </div>

          @if (responseJson(); as json) {
            <article class="demo-card demo-card--stack explorer__response-area">
              <p class="demo-eyebrow">Response</p>
              <h3>{{ lastEndpoint() }}</h3>
              <pre class="demo-code-block" data-testid="explorer-response-json">{{ json }}</pre>
            </article>
          }
        }
      </div>

      <div demoAside>
        <demo-inspector-panel
          title="API state"
          [snapshotJson]="snapshotJson()"
          snippetId=""
          panelTestId="explorer-inspector"
          snapshotTestId="explorer-snapshot"
          codeTestId="explorer-code"
        />
      </div>
    </demo-page-layout>
  `,
  styleUrl: './sample-api-explorer-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleApiExplorerPageComponent {
  readonly dotnetDemo = DOTNET_SAMPLE_API_EXPLORER;
  readonly dotnetPackage = computed(() => getDotnetPackage('hexguard-reference-data'));

  readonly apiBase = signal(DEFAULT_API_BASE);
  readonly discoveryResult = signal<any>(null);
  readonly responseJson = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly isBusy = signal(false);
  readonly lastEndpoint = signal<string | null>(null);
  readonly hasDiscovered = computed(() => this.discoveryResult() !== null);

  readonly dummyDemoEntry: DemoPageEntry = {
    id: 'sample-api',
    packageId: 'hexguard-reference-data',
    route: '/dotnet/sample-api',
    legacyRoute: '',
    label: 'SampleApi Explorer',
    title: 'Shared .NET Sample API',
    description: '',
    docsLinks: [],
    codeSample: { snippetId: '', label: '', description: '' },
  };

  readonly statusText = computed(() => {
    if (this.isBusy()) return 'Loading\u2026';
    if (this.error()) return 'Error';
    const result = this.discoveryResult();
    if (result) return `${result.packages.length} endpoint groups found`;
    return null;
  });

  readonly snapshotJson = computed(() => {
    const result = this.discoveryResult();
    if (!result) return '{}';
    return JSON.stringify(result, null, 2);
  });

  updateApiBase(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.apiBase.set(input.value);
  }

  async discoverEndpoints(): Promise<void> {
    this.isBusy.set(true);
    this.error.set(null);
    this.responseJson.set(null);

    try {
      const response = await fetch(this.apiBase());
      const data = await response.json();
      this.discoveryResult.set(data);

      this.responseJson.set(JSON.stringify(data, null, 2));
      this.lastEndpoint.set('/');
    } catch (err) {
      this.error.set(
        `Failed to discover endpoints: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      this.isBusy.set(false);
    }
  }

  async callEndpoint(path: string): Promise<void> {
    this.isBusy.set(true);
    this.error.set(null);

    const url = `${this.apiBase()}${path}`;

    try {
      const response = await fetch(url);
      const text = await response.text();

      // Pretty-print JSON if possible
      try {
        const parsed = JSON.parse(text);
        this.responseJson.set(JSON.stringify(parsed, null, 2));
      } catch {
        this.responseJson.set(text);
      }

      this.lastEndpoint.set(path);
    } catch (err) {
      this.error.set(`Request failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      this.isBusy.set(false);
    }
  }
}
