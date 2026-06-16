import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { DemoInspectorPanelComponent } from '../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../shared/components/demo-page-layout.component';
import { DOTNET_REFERENCE_DATA_HOME, getDotnetPackage } from '../../../../demo-registry';
import type { DemoPageEntry } from '../../../../demo-registry';

const API_BASE = 'http://127.0.0.1:5074';

@Component({
  standalone: true,
  selector: 'demo-reference-data-page',
  imports: [
    DemoPageLayoutComponent,
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
  ],
  template: `
    <demo-page-layout testId="reference-data-page">
      <demo-navigation-strip
        [demo]="dummyDemoEntry"
        testId="refdata-nav"
        [dotnetDemo]="dotnetDemo"
        [dotnetPackage]="dotnetPackage()"
        demoNavigation
      />

      <div demoIntro>
        <div class="reference-data-demo" data-testid="reference-data-demo-page">
          <article class="demo-card demo-card--stack">
            <p class="demo-eyebrow">HexGuard.ReferenceData</p>
            <h2>Typed reference-data catalog contracts and validation</h2>
            <p class="demo-card__summary">
              This page demonstrates the <code>HexGuard.ReferenceData</code> NuGet library through
              the shared .NET SampleApi. The library provides typed catalog contracts, collection
              and item types, and a built-in validator.
            </p>
          </article>

          <div class="reference-data-demo__toolbar">
            <div class="reference-data-demo__actions">
              <button
                class="demo-button"
                (click)="loadValidCatalog()"
                data-testid="refdata-load-valid"
                [disabled]="isBusy()"
              >
                Load valid catalog
              </button>
              <button
                class="demo-button demo-button--secondary"
                (click)="loadInvalidCatalog()"
                data-testid="refdata-load-invalid"
                [disabled]="isBusy()"
              >
                Load invalid catalog
              </button>
            </div>
            <span class="demo-hint-pill">{{ statusText() }}</span>
          </div>

          @if (error()) {
            <div class="demo-banner demo-banner--error" data-testid="refdata-error-banner">
              {{ error() }}
            </div>
          }
        </div>
      </div>

      <div demoPrimary>
        <div class="reference-data-demo__grid">
          <div class="reference-data-demo__contract-panel">
            <article class="demo-card demo-card--stack">
              <p class="demo-eyebrow">Library contracts</p>
              <h3>Public types</h3>
              <p class="demo-card__summary">The library exports these core types:</p>
              <ul class="reference-data-demo__type-list">
                <li class="reference-data-demo__type-item">
                  <strong>ReferenceDataCatalog</strong> — versioned root with metadata + collections
                </li>
                <li class="reference-data-demo__type-item">
                  <strong>ReferenceDataCatalogMetadata</strong> — Version + GeneratedAtUtc
                </li>
                <li class="reference-data-demo__type-item">
                  <strong>ReferenceDataCollection</strong> — named family with Key, Revision, Items
                </li>
                <li class="reference-data-demo__type-item">
                  <strong>ReferenceDataItem</strong> — lookup option with Key, Label, IsActive
                </li>
                <li class="reference-data-demo__type-item">
                  <strong>ReferenceDataCatalogValidator</strong> — validates contract
                </li>
                <li class="reference-data-demo__type-item">
                  <strong>IReferenceDataCatalogProvider</strong> — async provider interface
                </li>
                <li class="reference-data-demo__type-item">
                  <strong>StaticReferenceDataCatalogProvider</strong> — in-memory provider
                </li>
              </ul>
            </article>

            @if (validationResult(); as result) {
              <article class="demo-card demo-card--stack">
                <p class="demo-eyebrow">Validation</p>
                <h3>Results</h3>
                <div class="reference-data-demo__validation-results">
                  @if (result.isValid) {
                    <span
                      class="reference-data-demo__valid-badge reference-data-demo__valid-badge--pass"
                    >
                      ✓ Catalog is valid
                    </span>
                  } @else {
                    <span
                      class="reference-data-demo__valid-badge reference-data-demo__valid-badge--fail"
                    >
                      ✗ {{ result.errors.length }} validation error(s)
                    </span>
                    @for (err of result.errors; track err) {
                      <div class="reference-data-demo__error-item">{{ err }}</div>
                    }
                  }
                </div>
              </article>
            }
          </div>

          <div>
            @if (responseJson(); as json) {
              <article class="demo-card demo-card--stack">
                <p class="demo-eyebrow">API response</p>
                <h3>Raw JSON</h3>
                <pre class="demo-code-block" data-testid="refdata-response-json">{{ json }}</pre>
              </article>
            }
          </div>
        </div>
      </div>

      <div demoAside>
        <demo-inspector-panel
          title="Demo state"
          [snapshotJson]="snapshotJson()"
          snippetId=""
          panelTestId="refdata-inspector"
          snapshotTestId="refdata-snapshot"
          codeTestId="refdata-code"
        />
      </div>
    </demo-page-layout>
  `,
  styleUrl: './reference-data-demo-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferenceDataDemoPageComponent {
  readonly dotnetDemo = DOTNET_REFERENCE_DATA_HOME;
  readonly dotnetPackage = computed(() =>
    getDotnetPackage('hexguard-reference-data'),
  );

  readonly apiBase = API_BASE;

  readonly responseJson = signal<string | null>(null);
  readonly validationResult = signal<{ isValid: boolean; errors: readonly string[] } | null>(null);
  readonly error = signal<string | null>(null);
  readonly isBusy = signal(false);
  readonly lastScenario = signal<string | null>(null);

  readonly dummyDemoEntry: DemoPageEntry = {
    id: 'reference-data',
    packageId: 'hexguard-reference-data',
    route: '/dotnet/reference-data',
    legacyRoute: '',
    label: 'ReferenceData Library',
    title: 'HexGuard.ReferenceData',
    description: '',
    docsLinks: [],
    codeSample: { snippetId: '', label: '', description: '' },
  };

  readonly collectionCount = computed(() => {
    const json = this.responseJson();
    if (!json) return '\u2014';
    try {
      const parsed = JSON.parse(json);
      return String(parsed.collections?.length ?? parsed.catalog?.collections?.length ?? '\u2014');
    } catch {
      return '\u2014';
    }
  });

  readonly statusText = computed(() => {
    if (this.isBusy()) return 'Loading\u2026';
    if (this.error()) return 'Error';
    if (this.lastScenario()) return `Loaded: ${this.lastScenario()}`;
    return 'Idle \u2014 click a button to start';
  });

  readonly snapshotJson = computed(() => {
    const json = this.responseJson();
    if (!json) return '{}';
    return json;
  });

  private async fetchAndSet(url: string, scenarioLabel: string): Promise<void> {
    this.isBusy.set(true);
    this.error.set(null);
    this.validationResult.set(null);

    try {
      const response = await fetch(url);
      const text = await response.text();
      const parsed = JSON.parse(text);

      if (parsed.errors) {
        this.validationResult.set({ isValid: false, errors: parsed.errors });
      } else if (parsed.isValid !== undefined) {
        this.validationResult.set({ isValid: parsed.isValid, errors: parsed.errors ?? [] });
      }

      this.responseJson.set(JSON.stringify(parsed, null, 2));
      this.lastScenario.set(scenarioLabel);
    } catch (err) {
      this.error.set(`Request failed: ${err instanceof Error ? err.message : String(err)}`);
      this.lastScenario.set(null);
    } finally {
      this.isBusy.set(false);
    }
  }

  loadValidCatalog(): void {
    this.fetchAndSet(`${API_BASE}/api/reference-data/catalog`, 'Valid catalog');
  }

  loadInvalidCatalog(): void {
    this.fetchAndSet(`${API_BASE}/api/reference-data/catalog/invalid`, 'Invalid catalog');
  }
}
