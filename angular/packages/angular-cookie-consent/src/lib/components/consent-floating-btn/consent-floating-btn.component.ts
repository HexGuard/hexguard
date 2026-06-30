import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';

export type FloatingButtonPosition = 'bottom-left' | 'bottom-right';

/**
 * Floating button for persistent access to the preference center.
 * Shown after the user has made a first consent decision.
 *
 * @example
 * ```html
 * <hex-consent-floating-btn
 *   position="bottom-right"
 *   label="Cookie Settings"
 *   (click)="showPreferences.set(true)"
 * />
 * ```
 */
@Component({
  standalone: true,
  selector: 'hex-consent-floating-btn',
  template: `
    <button
      class="hex-consent-floating-btn"
      [class.hex-consent-floating-btn--left]="position() === 'bottom-left'"
      [class.hex-consent-floating-btn--right]="position() === 'bottom-right'"
      (click)="onClick()"
      aria-label="Open cookie preferences"
      data-testid="consent-floating-btn"
    >
      {{ label() }}
    </button>
  `,
  styles: [`
    .hex-consent-floating-btn {
      position: fixed;
      bottom: 16px;
      z-index: var(--hex-consent-z-index, 9999);
      padding: 8px 16px;
      background: var(--hex-consent-floating-btn-bg, #f8f8f8);
      color: var(--hex-consent-floating-btn-text, #333);
      border: 1px solid var(--hex-consent-banner-border, #ddd);
      border-radius: 20px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: box-shadow 0.2s;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .hex-consent-floating-btn:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .hex-consent-floating-btn--left { left: 16px; }
    .hex-consent-floating-btn--right { right: 16px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsentFloatingButtonComponent {
  readonly position = input<FloatingButtonPosition>('bottom-right');
  readonly label = input('Cookie Settings');
  readonly opened = model(false);

  onClick(): void {
    this.opened.set(true);
  }
}
