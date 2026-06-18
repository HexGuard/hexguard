import { inject } from '@angular/core';
import { type CanActivateFn, type CanMatchFn, Router, type UrlTree } from '@angular/router';

import { evaluateFeatureFlag } from './feature-flag-evaluator';
import type { FlagEvaluationContext } from './feature-flag-evaluator';
import { HEXGUARD_FEATURE_FLAG_CATALOG } from './feature-flag-providers';
import type { FlagKey } from './types';

/** Options for feature flag route guards. */
export interface FeatureFlagGuardOptions {
  /** The flag key to check before activating or matching a route. */
  flagKey: FlagKey;

  /**
   * The evaluation context to use for the check, or a factory function
   * that returns the context at evaluation time.
   *
   * Use a factory function when the context needs to be resolved lazily
   * (e.g., from an injected service rather than a static value).
   */
  context: FlagEvaluationContext | (() => FlagEvaluationContext);

  /**
   * Optional variant constraint. When set, the route only activates
   * if the resolved variant matches.
   */
  variant?: string;

  /**
   * Optional redirect URL. When access is denied, redirect to this
   * URL instead of returning `false`.
   */
  redirectTo?: string;
}

/**
 * Resolves the guard context — either returns the static value or
 * calls the factory function.
 */
function resolveContext(
  contextOrFactory: FlagEvaluationContext | (() => FlagEvaluationContext),
): FlagEvaluationContext {
  return typeof contextOrFactory === 'function'
    ? (contextOrFactory as () => FlagEvaluationContext)()
    : contextOrFactory;
}

/**
 * Returns a `CanActivateFn` that gates route activation on a feature flag.
 *
 * When the flag is disabled, returns `false` or a `UrlTree` redirect
 * if `redirectTo` is provided.
 */
export function canActivateFeatureFlag(options: FeatureFlagGuardOptions): CanActivateFn {
  return () => {
    const catalog = inject(HEXGUARD_FEATURE_FLAG_CATALOG);
    const router = inject(Router);
    const context = resolveContext(options.context);

    const flag = catalog().flags[options.flagKey];
    if (!flag) {
      return handleDenied(options, router);
    }

    const result = evaluateFeatureFlag(flag, context);
    const variantOk = options.variant === undefined || result.variant === options.variant;

    if (result.enabled && variantOk) {
      return true;
    }

    return handleDenied(options, router);
  };
}

/**
 * Returns a `CanMatchFn` that gates route matching on a feature flag.
 *
 * When the flag is disabled, returns `false` or a `UrlTree` redirect
 * if `redirectTo` is provided.
 */
export function canMatchFeatureFlag(options: FeatureFlagGuardOptions): CanMatchFn {
  return () => {
    const catalog = inject(HEXGUARD_FEATURE_FLAG_CATALOG);
    const router = inject(Router);
    const context = resolveContext(options.context);

    const flag = catalog().flags[options.flagKey];
    if (!flag) {
      return handleDenied(options, router);
    }

    const result = evaluateFeatureFlag(flag, context);
    const variantOk = options.variant === undefined || result.variant === options.variant;

    if (result.enabled && variantOk) {
      return true;
    }

    return handleDenied(options, router);
  };
}

/**
 * Returns `false` to deny route access, or a `UrlTree` to redirect.
 * Only allows relative URLs for redirect targets to prevent open redirects.
 */
function handleDenied(options: FeatureFlagGuardOptions, router: Router): boolean | UrlTree {
  if (options.redirectTo) {
    const redirect = options.redirectTo;
    // Only relative URLs are allowed to prevent open redirect vulnerabilities
    if (!redirect.startsWith('/')) {
      throw new Error(
        `Feature flag redirect target must be a relative URL (starting with /), got "${redirect}".`,
      );
    }
    return router.parseUrl(redirect);
  }
  return false;
}
