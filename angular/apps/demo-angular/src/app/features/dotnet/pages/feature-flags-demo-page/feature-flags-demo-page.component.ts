import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DemoInspectorPanelComponent } from '../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../shared/formatting';
import { createTrackedCurrentUrl } from '../../../../shared/current-url.signal';
import { DOTNET_FEATURE_FLAGS_HOME } from '../../../../demo-registry';
import { getDotnetPackage } from '../../../../demo-registry';
import type { DemoPageEntry } from '../../../../demo-registry';

interface FlagResult {
  key: string;
  enabled: boolean;
  variant: string;
  matchedRule: string | null;
}

@Component({
  standalone: true,
  selector: 'demo-feature-flags-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    FormsModule,
  ],
  templateUrl: './feature-flags-demo-page.component.html',
  styleUrl: './feature-flags-demo-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureFlagsDemoPageComponent {
  readonly demo = DOTNET_FEATURE_FLAGS_HOME;
  readonly DOTNET_FEATURE_FLAGS_PACKAGE = getDotnetPackage('hexguard-feature-flags');

  /** Dummy used by the shared demo-navigation-strip for the required [demo] input. */
  readonly dummyDemoEntry: DemoPageEntry = {
    id: 'feature-flags-dotnet',
    packageId: 'hexguard-feature-flags',
    route: '/dotnet/feature-flags',
    legacyRoute: '',
    label: 'FeatureFlags Library',
    title: this.demo.title,
    description: this.demo.description,
    docsLinks: this.demo.docsLinks,
    codeSample: { snippetId: '', label: '', description: '' },
  };

  readonly currentUrl = createTrackedCurrentUrl(this.demo.route);

  readonly personaId = signal<string>('guest');
  readonly responseJson = signal<string | null>(null);
  readonly flags = signal<FlagResult[]>([]);
  readonly error = signal<string | null>(null);
  readonly isBusy = signal(false);
  readonly lastRequestUrl = signal<string | null>(null);

  readonly personas = [
    { id: 'guest', label: 'Guest', userId: 'guest-1', groups: '', attrs: '' },
    {
      id: 'beta-tester',
      label: 'Beta Tester',
      userId: 'beta-user-1',
      groups: 'beta-testers',
      attrs: '',
    },
    {
      id: 'premium',
      label: 'Premium User',
      userId: 'premium-user-1',
      groups: 'premium-users',
      attrs: '',
    },
    {
      id: 'admin',
      label: 'Admin',
      userId: 'admin-1',
      groups: 'beta-testers,premium-users',
      attrs: 'preferences=dark-mode',
    },
  ];

  readonly selectedPersona = computed(
    () => this.personas.find((p) => p.id === this.personaId()) ?? this.personas[0],
  );

  readonly statusText = computed(() => {
    if (this.isBusy()) return 'Loading flags from API…';
    if (this.error()) return `Error: ${this.error()}`;
    const count = this.flags().length;
    const enabled = this.flags().filter((f) => f.enabled).length;
    return count > 0
      ? `Loaded ${count} flags — ${enabled} active for ${this.selectedPersona().label}`
      : 'Select a persona and load flags from the API';
  });

  readonly snapshotJson = computed(() =>
    formatSnapshot({
      persona: this.selectedPersona().label,
      userId: this.selectedPersona().userId,
      groups: this.selectedPersona().groups || '(none)',
      attributes: this.selectedPersona().attrs || '(none)',
      flags: this.flags().map((f) => ({
        key: f.key,
        enabled: f.enabled,
        variant: f.variant,
        matchedRule: f.matchedRule ?? '(fallthrough)',
      })),
    }),
  );

  private readonly apiBase = 'http://127.0.0.1:5250';

  async loadFlags(): Promise<void> {
    const p = this.selectedPersona();
    const params = new URLSearchParams({ userId: p.userId });
    if (p.groups) params.set('groups', p.groups);
    if (p.attrs) params.set('attributes', p.attrs);
    const url = `${this.apiBase}/api/feature-flags/evaluate-all?${params}`;
    this.lastRequestUrl.set(url);

    this.isBusy.set(true);
    this.error.set(null);
    this.flags.set([]);

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const body: FlagResult[] = await res.json();
      this.flags.set(body);
      this.responseJson.set(JSON.stringify(body, null, 2));
    } catch (cause) {
      this.error.set(cause instanceof Error ? cause.message : String(cause));
      this.responseJson.set(null);
    } finally {
      this.isBusy.set(false);
    }
  }

  updatePersona(id: string): void {
    this.personaId.set(id);
    this.flags.set([]);
    this.responseJson.set(null);
    this.error.set(null);
  }
}
