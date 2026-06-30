import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
  input,
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
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly consent = injectConsentManager();
  private readonly templateRef = inject(TemplateRef<unknown>);

  /** The consent category to check. */
  readonly hexConsent = input.required<string>({ alias: 'hexConsent' });

  /** Optional template to show when consent is denied. */
  readonly hexConsentElse = input<TemplateRef<unknown>>(undefined, { alias: 'hexConsentElse' });

  constructor() {
    effect(() => {
      const categoryId = this.hexConsent();
      const isGranted = this.consent.isCategoryGranted(categoryId)();

      this.viewContainer.clear();
      if (isGranted) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        const elseTpl = this.hexConsentElse();
        if (elseTpl) {
          this.viewContainer.createEmbeddedView(elseTpl);
        }
      }
    });
  }
}
