import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import { injectConsentManager } from '@hexguard/angular-consent-manager';

export type PreferenceCenterMode = 'modal' | 'drawer' | 'inline';

/**
 * Detailed consent preference panel.
 * Shows all categories with toggles, purpose descriptions, and save/reset actions.
 *
 * @example
 * ```html
 * <hex-consent-preference-center
 *   [(open)]="showPreferences"
 *   mode="modal"
 * />
 * ```
 */
@Component({
  standalone: true,
  selector: 'hex-consent-preference-center',
  template: `
    @if (mode() === 'modal' || mode() === 'drawer') {
      @if (open()) {
        <div class="hex-consent-overlay" (click)="close()" data-testid="consent-overlay"></div>
      }
    }

    @if (open() || mode() === 'inline') {
      <div
        class="hex-consent-panel"
        [class.hex-consent-panel--modal]="mode() === 'modal'"
        [class.hex-consent-panel--drawer]="mode() === 'drawer'"
        [class.hex-consent-panel--inline]="mode() === 'inline'"
        [class.hex-consent-panel--open]="open()"
        role="dialog"
        aria-modal="true"
        aria-label="Cookie preferences"
        data-testid="consent-preference-center"
      >
        <div class="hex-consent-panel__header">
          <ng-content select="[slot=header]">
            <h2 class="hex-consent-panel__title">Cookie Preferences</h2>
            @if (mode() !== 'inline') {
              <button class="hex-consent-panel__close" (click)="close()" aria-label="Close">&times;</button>
            }
          </ng-content>
        </div>

        <div class="hex-consent-panel__body">
          @for (cat of categories(); track cat.id) {
            <div class="hex-consent-category" [attr.data-testid]="'consent-category-' + cat.id">
              <div class="hex-consent-category__row">
                <div class="hex-consent-category__info">
                  <span class="hex-consent-category__label">{{ cat.label }}</span>
                  <span class="hex-consent-category__desc">{{ cat.description }}</span>
                </div>
                <label class="hex-consent-toggle" [class.hex-consent-toggle--disabled]="cat.required">
                  <input
                    type="checkbox"
                    [checked]="getCategoryState(cat.id)()"
                    [disabled]="cat.required"
                    (change)="toggleCategory(cat.id, $event)"
                    data-testid="consent-category-toggle"
                  />
                  <span class="hex-consent-toggle__slider"></span>
                </label>
              </div>
              @if (cat.purposes.length) {
                <details class="hex-consent-category__purposes">
                  <summary>Purposes ({{ cat.purposes.length }})</summary>
                  <ul>
                    @for (purpose of cat.purposes; track purpose.id) {
                      <li>
                        <strong>{{ purpose.label }}</strong>
                        <p>{{ purpose.description }}</p>
                      </li>
                    }
                  </ul>
                </details>
              }
            </div>
          }
        </div>

        <div class="hex-consent-panel__footer">
          <ng-content select="[slot=footer]">
            <button class="hex-consent-btn hex-consent-btn--primary" (click)="save()" data-testid="consent-save">
              Save Preferences
            </button>
            <button class="hex-consent-btn hex-consent-btn--secondary" (click)="acceptAll()">
              Accept All
            </button>
            <button class="hex-consent-btn hex-consent-btn--text" (click)="rejectAll()">
              Reject All
            </button>
          </ng-content>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: contents; }
    .hex-consent-overlay {
      position: fixed; inset: 0;
      background: var(--hex-consent-overlay-bg, rgba(0,0,0,0.5));
      z-index: calc(var(--hex-consent-z-index, 9999) - 1);
    }
    .hex-consent-panel {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      color: var(--hex-consent-banner-text, #1a1a1a);
      background: var(--hex-consent-banner-bg, #fff);
    }
    .hex-consent-panel--modal {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      max-width: 640px; width: 90%; max-height: 80vh;
      z-index: var(--hex-consent-z-index, 9999);
      border-radius: 8px; box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      display: flex; flex-direction: column;
    }
    .hex-consent-panel--drawer {
      position: fixed; top: 0; right: 0; bottom: 0;
      width: 480px; max-width: 100vw;
      z-index: var(--hex-consent-z-index, 9999);
      box-shadow: -4px 0 16px rgba(0,0,0,0.1);
      display: flex; flex-direction: column;
      transform: translateX(100%);
      transition: transform 0.25s ease;
    }
    .hex-consent-panel--drawer.hex-consent-panel--open { transform: translateX(0); }
    .hex-consent-panel--inline { position: relative; border: 1px solid var(--hex-consent-banner-border, #e0e0e0); border-radius: 8px; }
    .hex-consent-panel__header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px; border-bottom: 1px solid var(--hex-consent-banner-border, #e0e0e0);
    }
    .hex-consent-panel__title { margin: 0; font-size: 18px; font-weight: 600; }
    .hex-consent-panel__close {
      background: none; border: none; font-size: 24px; cursor: pointer; color: inherit; padding: 4px 8px;
    }
    .hex-consent-panel__body { flex: 1; overflow-y: auto; padding: 16px 20px; }
    .hex-consent-panel__footer {
      display: flex; gap: 8px; flex-wrap: wrap;
      padding: 16px 20px; border-top: 1px solid var(--hex-consent-banner-border, #e0e0e0);
    }
    .hex-consent-category { padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
    .hex-consent-category:last-child { border-bottom: none; }
    .hex-consent-category__row { display: flex; align-items: flex-start; gap: 12px; }
    .hex-consent-category__info { flex: 1; }
    .hex-consent-category__label { display: block; font-weight: 600; margin-bottom: 4px; }
    .hex-consent-category__desc { display: block; color: var(--hex-consent-banner-text-secondary, #666); font-size: 13px; }
    .hex-consent-category__purposes { margin-top: 8px; font-size: 13px; color: #555; }
    .hex-consent-category__purposes summary { cursor: pointer; color: var(--hex-consent-btn-primary-bg, #0066cc); }
    .hex-consent-category__purposes ul { margin: 8px 0 0; padding-left: 20px; }
    .hex-consent-category__purposes li { margin-bottom: 6px; }
    .hex-consent-category__purposes p { margin: 2px 0 0; color: #666; }

    .hex-consent-toggle {
      position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0;
    }
    .hex-consent-toggle input { opacity: 0; width: 0; height: 0; }
    .hex-consent-toggle__slider {
      position: absolute; cursor: pointer; inset: 0;
      background: var(--hex-consent-toggle-inactive, #ccc);
      border-radius: 12px; transition: 0.2s;
    }
    .hex-consent-toggle__slider::before {
      content: ''; position: absolute; width: 20px; height: 20px;
      left: 2px; bottom: 2px; background: #fff; border-radius: 50%; transition: 0.2s;
    }
    .hex-consent-toggle input:checked + .hex-consent-toggle__slider {
      background: var(--hex-consent-toggle-active, #0066cc);
    }
    .hex-consent-toggle input:checked + .hex-consent-toggle__slider::before {
      transform: translateX(20px);
    }
    .hex-consent-toggle--disabled .hex-consent-toggle__slider {
      opacity: 0.6; cursor: not-allowed;
    }
    .hex-consent-btn {
      padding: 8px 20px; border: 1px solid transparent; border-radius: 6px;
      cursor: pointer; font-size: 14px; font-weight: 500; transition: opacity 0.15s;
    }
    .hex-consent-btn:hover { opacity: 0.85; }
    .hex-consent-btn--primary { background: var(--hex-consent-btn-primary-bg, #0066cc); color: var(--hex-consent-btn-primary-text, #fff); }
    .hex-consent-btn--secondary { background: var(--hex-consent-btn-secondary-bg, #f0f0f0); color: var(--hex-consent-btn-secondary-text, #333); border-color: #d0d0d0; }
    .hex-consent-btn--text { background: transparent; color: var(--hex-consent-btn-primary-bg, #0066cc); text-decoration: underline; padding: 8px 12px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsentPreferenceCenterComponent {
  readonly mode = input<PreferenceCenterMode>('modal');
  readonly open = model(false);

  private readonly consent = injectConsentManager();

  readonly categories = computed(() => this.consent.categories());

  getCategoryState(categoryId: string) {
    return computed(() => this.consent.state()[categoryId] === true);
  }

  toggleCategory(categoryId: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.consent.acceptCategory(categoryId);
    } else {
      this.consent.rejectCategory(categoryId);
    }
  }

  save(): void {
    this.open.set(false);
  }

  acceptAll(): void {
    this.consent.acceptAll();
    this.open.set(false);
  }

  rejectAll(): void {
    this.consent.rejectAll();
    this.open.set(false);
  }

  close(): void {
    this.open.set(false);
  }
}
