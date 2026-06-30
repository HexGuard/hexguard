import {
  Directive,
  computed,
  inject,
  input,
  templateRef,
  ViewContainerRef,
} from '@angular/core';
import { injectConsentManager } from '@hexguard/angular-consent-manager';

/**
 * Structural directive that conditionally renders content based on consent category.
 *
 * @example
 * ```html
 * <!-- Show only when analytics is granted -->
 * <div *hexConsent="'analytics'">
 *   Google Analytics scripts will render here.
 * </div>
 *
 * <!-- With else template -->
 * <ng-template #denied>
 *   <p>Analytics is disabled.</p>
 * </ng-template>
 * <div *hexConsent="'analytics'; else denied">
 *   Analytics content
 * </div>
 * ```
 */
@Directive({
  standalone: true,
  selector: '[hexConsent]',
})
export class ConsentDirective {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly consent = injectConsentManager();

  /** The consent category to check. */
  readonly hexConsent = input.required<string>({ alias: 'hexConsent' });

  /** Optional template to show when consent is denied. */
  readonly hexConsentElse = input<TemplateRef<unknown>>(undefined, { alias: 'hexConsentElse' });

  private readonly isGranted = computed(() => {
    const categoryId = this.hexConsent();
    return this.consent.isCategoryGranted(categoryId)();
  });

  constructor() {
    // Initial render
    this.updateView();

    // React to changes via effect
    import('@angular/core').then(({ effect }) => {
      effect(() => {
        this.isGranted();
        this.updateView();
      });
    });
  }

  private updateView(): void {
    this.viewContainer.clear();
    if (this.isGranted()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      const elseTpl = this.hexConsentElse();
      if (elseTpl) {
        this.viewContainer.createEmbeddedView(elseTpl);
      }
    }
  }
}
