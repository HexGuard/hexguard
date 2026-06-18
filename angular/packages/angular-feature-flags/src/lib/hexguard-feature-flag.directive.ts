import { DestroyRef, Directive, effect, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';

import { evaluateFeatureFlag } from './feature-flag-evaluator';
import type { FlagEvaluationContext } from './feature-flag-evaluator';
import { HEXGUARD_FEATURE_FLAG_CATALOG } from './feature-flag-providers';
import type { FlagKey } from './types';

/**
 * Structural directive that conditionally renders content based on a
 * feature flag's evaluation result.
 *
 * Usage:
 * ```html
 * <ng-container *hexguardFeatureFlag="'beta-search'; context: evalCtx">
 *   Beta search content
 * </ng-container>
 *
 * <ng-container *hexguardFeatureFlag="'dark-mode'; context: evalCtx; variant 'dark'">
 *   Conditional dark-mode content
 * </ng-container>
 *
 * <ng-container *hexguardFeatureFlag="'premium-x'; context: evalCtx; else fallback">
 *   Premium content
 * </ng-container>
 * <ng-template #fallback>Upgrade to access</ng-template>
 * ```
 */
@Directive({
  selector: '[hexguardFeatureFlag]',
  standalone: true,
})
export class HexguardFeatureFlagDirective {
  private readonly catalog = inject(HEXGUARD_FEATURE_FLAG_CATALOG);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);

  /** The flag key to evaluate. */
  readonly hexguardFeatureFlag = input.required<FlagKey>();

  /** Evaluation context for flag resolution. */
  readonly hexguardFeatureFlagContext = input.required<FlagEvaluationContext>();

  /** Optional variant constraint. When set, content only renders if
   *  the resolved variant matches. */
  readonly hexguardFeatureFlagVariant = input<string>();

  /** Optional fallback template shown when the flag is disabled or
   *  variant doesn't match. */
  readonly hexguardFeatureFlagElse = input<TemplateRef<unknown>>();

  constructor() {
    effect(() => {
      const flagKey = this.hexguardFeatureFlag();
      const context = this.hexguardFeatureFlagContext();
      const requiredVariant = this.hexguardFeatureFlagVariant();

      const flag = this.catalog().flags[flagKey];
      let show = false;

      if (flag) {
        const result = evaluateFeatureFlag(flag, context);
        show =
          result.enabled &&
          (requiredVariant === undefined || result.variant === requiredVariant);
      }

      this.viewContainer.clear();

      if (show) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        const elseTemplate = this.hexguardFeatureFlagElse();
        if (elseTemplate) {
          this.viewContainer.createEmbeddedView(elseTemplate);
        }
      }
    });
  }
}
