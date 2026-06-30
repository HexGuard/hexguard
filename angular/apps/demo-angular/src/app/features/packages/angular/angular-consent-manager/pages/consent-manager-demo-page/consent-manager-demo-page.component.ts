import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { injectConsentManager, defaultConsentCategories, injectConsentAudit } from '@hexguard/angular-consent-manager';
import { ANGULAR_CONSENT_MANAGER_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';
import { DEMO_REGIONS, DEMO_CONSENT_COOKIES } from '../../data/consent-manager-demo.data';

@Component({
  standalone: true,
  selector: 'demo-consent-manager-demo-page',
  templateUrl: './consent-manager-demo-page.component.html',
  styleUrl: './consent-manager-demo-page.component.css',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsentManagerDemoPageComponent {
  protected readonly demo = ANGULAR_CONSENT_MANAGER_DEMO;
  protected readonly consent = injectConsentManager();
  protected readonly audit = injectConsentAudit();
  protected readonly regions = DEMO_REGIONS;
  protected readonly demoCookies = DEMO_CONSENT_COOKIES;
  protected selectedRegion = signal('');

  protected readonly statusLabel = computed(() => {
    const s = this.consent.status();
    switch (s) {
      case 'unknown': return 'No decision';
      case 'granted': return 'Consent given';
      case 'denied': return 'All rejected';
      case 'expired': return 'Consent expired';
      default: return s;
    }
  });

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      status: this.consent.status(),
      region: this.consent.region(),
      consentId: this.consent.consentId(),
      consentedAt: this.consent.consentedAt(),
      expiresAt: this.consent.expiresAt(),
      isConsented: this.consent.isConsented(),
      hasDecided: this.consent.hasDecided(),
      isExpired: this.consent.isExpired(),
      state: this.consent.state(),
    }),
  );

  protected readonly auditJson = computed(() =>
    formatSnapshot(this.audit.getRecords()),
  );

  protected onSelectRegion(code: string): void {
    this.selectedRegion.set(code);
  }
}
