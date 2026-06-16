import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DemoInspectorPanelComponent } from '../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../shared/components/demo-page-layout.component';
import { DOTNET_VALIDATION_CONTRACTS_HOME, getDotnetPackage } from '../../../../demo-registry';
import type { DemoPageEntry } from '../../../../demo-registry';

const API_BASE = 'http://127.0.0.1:5074';

@Component({
  standalone: true,
  selector: 'demo-validation-contracts-page',
  imports: [
    DemoPageLayoutComponent,
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
  ],
  templateUrl: './validation-contracts-demo-page.component.html',
  styleUrls: ['./validation-contracts-demo-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationContractsDemoPageComponent {
  readonly dotnetDemo = DOTNET_VALIDATION_CONTRACTS_HOME;
  readonly dotnetPackage = computed(() => getDotnetPackage('hexguard-validation-contracts'));

  readonly apiBase = API_BASE;

  readonly responseJson = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly isBusy = signal(false);
  readonly lastScenario = signal<string | null>(null);
  readonly lastUrl = signal<string | null>(null);

  readonly dummyDemoEntry: DemoPageEntry = {
    id: 'validation-contracts',
    packageId: 'hexguard-validation-contracts',
    route: '/dotnet/validation-contracts',
    legacyRoute: '',
    label: 'ValidationContracts Library',
    title: 'HexGuard.ValidationContracts',
    description: '',
    docsLinks: [],
    codeSample: { snippetId: '', label: '', description: '' },
  };

  readonly statusText = computed(() => {
    if (this.isBusy()) return 'Loading\u2026';
    if (this.error()) return 'Error';
    if (this.lastScenario()) return `Loaded: ${this.lastScenario()}`;
    return 'Idle \u2014 click a button to start';
  });

  readonly snapshotJson = computed(() => this.responseJson() ?? '{}');

  private async fetchFromApi(url: string, scenarioLabel: string): Promise<void> {
    this.isBusy.set(true);
    this.error.set(null);
    this.lastUrl.set(url);

    try {
      const response = await fetch(url);
      const text = await response.text();

      // Try to format as pretty JSON
      try {
        const parsed = JSON.parse(text);
        this.responseJson.set(JSON.stringify(parsed, null, 2));
      } catch {
        this.responseJson.set(text);
      }

      this.lastScenario.set(scenarioLabel);
    } catch (err) {
      this.error.set(`Request failed: ${err instanceof Error ? err.message : String(err)}`);
      this.responseJson.set(null);
      this.lastScenario.set(null);
    } finally {
      this.isBusy.set(false);
    }
  }

  loadErrorCodes(): void {
    this.fetchFromApi(`${API_BASE}/api/validation-contracts/error-codes`, 'Error codes');
  }

  validateProduct(): void {
    const url = `${API_BASE}/api/validation-contracts/validate`;
    const payload = {
      name: 'Wireless Mouse',
      price: 29.99,
      category: 'Electronics',
      sku: 'ELE-123456',
      tags: ['new', 'popular'],
    };

    this.isBusy.set(true);
    this.error.set(null);
    this.lastUrl.set(url);

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        const text = await response.text();
        try {
          const parsed = JSON.parse(text);
          this.responseJson.set(JSON.stringify(parsed, null, 2));
        } catch {
          this.responseJson.set(text);
        }
        this.lastScenario.set('Valid product');
      })
      .catch((err) => {
        this.error.set(`Request failed: ${err instanceof Error ? err.message : String(err)}`);
        this.responseJson.set(null);
        this.lastScenario.set(null);
      })
      .finally(() => this.isBusy.set(false));
  }

  validateInvalid(): void {
    const url = `${API_BASE}/api/validation-contracts/validate`;
    const payload = {
      name: '',
      price: -5,
      category: 'Unknown',
    };

    this.isBusy.set(true);
    this.error.set(null);
    this.lastUrl.set(url);

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        const text = await response.text();
        try {
          const parsed = JSON.parse(text);
          this.responseJson.set(JSON.stringify(parsed, null, 2));
        } catch {
          this.responseJson.set(text);
        }
        this.lastScenario.set('Invalid product');
      })
      .catch((err) => {
        this.error.set(`Request failed: ${err instanceof Error ? err.message : String(err)}`);
        this.responseJson.set(null);
        this.lastScenario.set(null);
      })
      .finally(() => this.isBusy.set(false));
  }
}
