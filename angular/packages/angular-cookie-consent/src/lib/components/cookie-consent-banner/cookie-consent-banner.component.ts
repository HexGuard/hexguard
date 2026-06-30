import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import { injectConsentManager } from '@hexguard/angular-consent-manager';

export type BannerPosition = 'bottom' | 'top' | 'center';

/**
 * First-layer cookie consent banner.
 * Shown when consent status is `'unknown'` or `'expired'`.
 *
 * @example
 * ```html
 * <hex-cookie-consent-banner
 *   position="bottom"
 *   (customize)="showPreferences.set(true)"
 * />
 * ```
 */
@Component({
  standalone: true,
  selector: 'hex-cookie-consent-banner',
  template: `
    @if (visible()) {
      <div
        class="hex-consent-banner"
        [class.hex-consent-banner--bottom]="position() === 'bottom'"
        [class.hex-consent-banner--top]="position() === 'top'"
        [class.hex-consent-banner--center]="position() === 'center'"
        role="dialog"
        aria-label="Cookie consent"
        data-testid="cookie-consent-banner"
      >
        <div class="hex-consent-banner__content">
          <div class="hex-consent-banner__message">
            <ng-content select="[slot=title]">
              <p class="hex-consent-banner__heading">This site uses cookies</p>
            </ng-content>
            <ng-content select="[slot=message]">
              <p class="hex-consent-banner__text">
                We use cookies to improve your experience, analyze traffic, and serve personalized content.
                You can choose which categories to allow.
              </p>
            </ng-content>
          </div>
          <div class="hex-consent-banner__actions">
            <ng-content select="[slot=actions]">
              <button
                class="hex-consent-btn hex-consent-btn--primary"
                (click)="onAcceptAll()"
                data-testid="cookie-consent-accept-all"
              >
                Accept All
              </button>
              <button
                class="hex-consent-btn hex-consent-btn--secondary"
                (click)="onRejectAll()"
                data-testid="cookie-consent-reject-all"
              >
                Reject All
              </button>
              <button
                class="hex-consent-btn hex-consent-btn--text"
                (click)="onCustomize()"
                data-testid="cookie-consent-customize"
              >
                Customize
              </button>
            </ng-content>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: contents; }
    .hex-consent-banner {
      position: fixed;
      z-index: var(--hex-consent-z-index, 9999);
      background: var(--hex-consent-banner-bg, #ffffff);
      color: var(--hex-consent-banner-text, #1a1a1a);
      border: 1px solid var(--hex-consent-banner-border, #e0e0e0);
      box-shadow: 0 -2px 16px rgba(0,0,0,0.08);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.5;
    }
    .hex-consent-banner--bottom {
      bottom: 0; left: 0; right: 0;
    }
    .hex-consent-banner--top {
      top: 0; left: 0; right: 0;
    }
    .hex-consent-banner--center {
      top: 50%; left: 50%; transform: translate(-50%, -50%);
      max-width: 480px;
      border-radius: 8px;
    }
    .hex-consent-banner__content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px 24px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 16px;
    }
    .hex-consent-banner--center .hex-consent-banner__content {
      flex-direction: column;
    }
    .hex-consent-banner__message { flex: 1; min-width: 240px; }
    .hex-consent-banner__heading {
      margin: 0 0 4px;
      font-size: 15px;
      font-weight: 600;
    }
    .hex-consent-banner__text {
      margin: 0;
      color: var(--hex-consent-banner-text-secondary, #666);
    }
    .hex-consent-banner__actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .hex-consent-btn {
      padding: 8px 20px;
      border: 1px solid transparent;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: opacity 0.15s;
    }
    .hex-consent-btn:hover { opacity: 0.85; }
    .hex-consent-btn--primary {
      background: var(--hex-consent-btn-primary-bg, #0066cc);
      color: var(--hex-consent-btn-primary-text, #ffffff);
    }
    .hex-consent-btn--secondary {
      background: var(--hex-consent-btn-secondary-bg, #f0f0f0);
      color: var(--hex-consent-btn-secondary-text, #333333);
      border-color: #d0d0d0;
    }
    .hex-consent-btn--text {
      background: transparent;
      color: var(--hex-consent-btn-primary-bg, #0066cc);
      text-decoration: underline;
      padding: 8px 12px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookieConsentBannerComponent {
  readonly position = input<BannerPosition>('bottom');

  /** Emitted when the user clicks "Customize". Parent should open preference center. */
  @Output() readonly customize = new EventEmitter<void>();

  private readonly consent = injectConsentManager();

  readonly visible = computed(() => {
    const status = this.consent.status();
    const expired = this.consent.isExpired();
    return status === 'unknown' || expired;
  });

  onAcceptAll(): void {
    this.consent.acceptAll();
  }

  onRejectAll(): void {
    this.consent.rejectAll();
  }

  onCustomize(): void {
    this.customize.emit();
  }
}
