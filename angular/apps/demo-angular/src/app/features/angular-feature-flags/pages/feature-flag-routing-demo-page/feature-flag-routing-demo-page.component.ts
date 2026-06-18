import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { provideHexGuardFeatureFlags } from '@hexguard/angular-feature-flags';

import { ANGULAR_FEATURE_FLAGS_ROUTING_DEMO } from '../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../shared/components/demo-status-strip.component';
import { createTrackedCurrentUrl } from '../../../../shared/current-url.signal';
import { formatSnapshot } from '../../../../shared/formatting';
import {
  FEATURE_FLAG_DEMO_CATALOG,
  FEATURE_FLAG_DEMO_PERSONAS,
  FeatureFlagsDemoSessionService,
} from '../../data/feature-flags-demo.data';

@Component({
  standalone: true,
  selector: 'demo-feature-flag-routing-demo-page',
  providers: [
    provideHexGuardFeatureFlags(FEATURE_FLAG_DEMO_CATALOG),
  ],
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './feature-flag-routing-demo-page.component.html',
  styleUrl: './feature-flag-routing-demo-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureFlagRoutingDemoPageComponent {
  readonly demo = ANGULAR_FEATURE_FLAGS_ROUTING_DEMO;
  readonly personas = FEATURE_FLAG_DEMO_PERSONAS;
  readonly session = inject(FeatureFlagsDemoSessionService);
  readonly currentUrl = createTrackedCurrentUrl(this.demo.route);

  readonly snapshotJson = computed(() =>
    formatSnapshot({
      personaId: this.session.persona().id,
      context: this.session.context(),
      protectedRouteAccess: {
        'premium-content': this.session.getEffectiveResult(
          FEATURE_FLAG_DEMO_CATALOG.flags['premium-feature-x']!,
        ).enabled,
      },
    }),
  );

  readonly statusSummary = computed(() => {
    const hasPremium = this.session.getEffectiveResult(
      FEATURE_FLAG_DEMO_CATALOG.flags['premium-feature-x']!,
    ).enabled;
    return hasPremium
      ? `${this.session.persona().label} has premium route access.`
      : `${this.session.persona().label} will be redirected from premium routes.`;
  });

  updatePersona(id: string): void {
    this.session.setPersona(id);
  }
}
