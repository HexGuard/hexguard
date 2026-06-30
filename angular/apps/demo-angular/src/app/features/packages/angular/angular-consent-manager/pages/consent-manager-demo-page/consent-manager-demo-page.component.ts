import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DatePipe, JsonPipe, SlicePipe } from '@angular/common';
import { injectConsentManager, defaultConsentCategories, injectConsentAudit, injectTcfApi, IAB_PURPOSES, decodeTcString } from '@hexguard/angular-consent-manager';
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
    DatePipe,
    JsonPipe,
    SlicePipe,
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
  protected readonly tcf = injectTcfApi();
  protected readonly iabPurposes = IAB_PURPOSES;
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
      tcString: this.tcf.tcString(),
      tcfAvailable: this.tcf.isAvailable(),
      auditRecords: this.audit.getRecords().length,
    }),
  );

  protected readonly auditJson = computed(() =>
    formatSnapshot(this.audit.getRecords()),
  );

  /** Reactive audit records — recomputes whenever consent status or state changes. */
  protected readonly auditRecords = computed(() => {
    // Track consent changes so this computed re-evaluates
    this.consent.status();
    this.consent.state();
    return this.audit.getRecords();
  });

  protected readonly tcfPurposeStates = computed(() =>
    this.iabPurposes.map(p => ({
      id: p.id,
      name: p.name,
      consented: this.tcf.isPurposeConsented(p.id)(),
    })),
  );

  protected readonly decodedTcString = computed(() => {
    const tc = this.tcf.tcString();
    if (!tc) return null;
    return decodeTcString(tc);
  });

  protected onSelectRegion(code: string): void {
    this.consent.setRegion(code);
    this.selectedRegion.set(code);
  }

  protected downloadAudit(): void {
    const json = this.audit.exportRecords();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consent-audit-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
