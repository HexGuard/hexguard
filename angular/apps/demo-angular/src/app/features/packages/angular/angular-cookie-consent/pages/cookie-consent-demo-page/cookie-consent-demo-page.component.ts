import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { injectConsentManager } from '@hexguard/angular-consent-manager';
import { CookieConsentBannerComponent, ConsentPreferenceCenterComponent, ConsentFloatingButtonComponent, CookieDeclarationComponent } from '@hexguard/angular-cookie-consent';
import { ANGULAR_COOKIE_CONSENT_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

const DEMO_COOKIES = [
  { name: 'session_id', domain: 'example.com', party: 'first' as const, purpose: 'Session management', category: 'necessary', duration: 'Session', type: 'cookie' as const },
  { name: 'csrf_token', domain: 'example.com', party: 'first' as const, purpose: 'Security', category: 'necessary', duration: 'Session', type: 'cookie' as const },
  { name: 'lang_pref', domain: 'example.com', party: 'first' as const, purpose: 'Language preference', category: 'functional', duration: '365 days', type: 'cookie' as const },
  { name: '_ga', domain: 'example.com', party: 'third' as const, purpose: 'Page views', category: 'analytics', duration: '730 days', type: 'cookie' as const },
  { name: '_fbp', domain: 'example.com', party: 'third' as const, purpose: 'Ad personalization', category: 'marketing', duration: '90 days', type: 'cookie' as const },
];

@Component({
  standalone: true,
  selector: 'demo-cookie-consent-demo-page',
  templateUrl: './cookie-consent-demo-page.component.html',
  styleUrl: './cookie-consent-demo-page.component.css',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    CookieConsentBannerComponent,
    ConsentPreferenceCenterComponent,
    ConsentFloatingButtonComponent,
    CookieDeclarationComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookieConsentDemoPageComponent {
  protected readonly demo = ANGULAR_COOKIE_CONSENT_DEMO;
  protected readonly consent = injectConsentManager();
  protected readonly showPreferences = signal(false);
  protected readonly demoCookies = DEMO_COOKIES;

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      status: this.consent.status(),
      state: this.consent.state(),
      isConsented: this.consent.isConsented(),
      hasDecided: this.consent.hasDecided(),
      isExpired: this.consent.isExpired(),
      consentId: this.consent.consentId(),
      region: this.consent.region(),
    }),
  );
}
