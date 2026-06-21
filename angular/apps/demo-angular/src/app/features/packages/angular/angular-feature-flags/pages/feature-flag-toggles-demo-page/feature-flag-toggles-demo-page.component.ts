import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { provideHexGuardFeatureFlags } from '@hexguard/angular-feature-flags';
import { HexguardFeatureFlagDirective } from '@hexguard/angular-feature-flags';

import { ANGULAR_FEATURE_FLAGS_TOGGLES_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { createTrackedCurrentUrl } from '../../../../../../shared/current-url.signal';
import { formatSnapshot } from '../../../../../../shared/formatting';
import {
  FEATURE_FLAG_DEMO_CATALOG,
  FEATURE_FLAG_DEMO_PERSONAS,
  FeatureFlagsDemoSessionService,
} from '../../data/feature-flags-demo.data';

@Component({
  standalone: true,
  selector: 'demo-feature-flag-toggles-demo-page',
  providers: [provideHexGuardFeatureFlags(FEATURE_FLAG_DEMO_CATALOG)],
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    FormsModule,
    HexguardFeatureFlagDirective,
  ],
  templateUrl: './feature-flag-toggles-demo-page.component.html',
  styleUrl: './feature-flag-toggles-demo-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureFlagTogglesDemoPageComponent {
  readonly demo = ANGULAR_FEATURE_FLAGS_TOGGLES_DEMO;
  readonly personas = FEATURE_FLAG_DEMO_PERSONAS;
  readonly session = inject(FeatureFlagsDemoSessionService);
  readonly flags = FEATURE_FLAG_DEMO_CATALOG.flags;
  readonly flagKeys = Object.keys(FEATURE_FLAG_DEMO_CATALOG.flags) as Array<
    keyof typeof FEATURE_FLAG_DEMO_CATALOG.flags
  >;
  readonly currentUrl = createTrackedCurrentUrl(this.demo.route);

  readonly flagResults = computed(() =>
    this.flagKeys.map((key) => {
      const flag = this.flags[key];
      const result = this.session.getEffectiveResult(flag);
      const override = this.session.flagOverrides()[key] ?? null;
      return { key, flag, result, override };
    }),
  );

  readonly snapshotJson = computed(() =>
    formatSnapshot({
      personaId: this.session.persona().id,
      context: this.session.context(),
      flags: Object.fromEntries(
        this.flagResults().map(({ key, result, override }) => [
          key,
          { enabled: result.enabled, variant: result.variant, override },
        ]),
      ),
    }),
  );

  readonly statusSummary = computed(() => {
    const enabled = this.flagResults().filter((r) => r.result.enabled).length;
    const total = this.flagKeys.length;
    return `${this.session.persona().label}: ${enabled}/${total} flags active.`;
  });

  updatePersona(id: string): void {
    this.session.setPersona(id);
  }

  toggleOverride(flagKey: string): void {
    this.session.toggleOverride(flagKey);
  }
}
