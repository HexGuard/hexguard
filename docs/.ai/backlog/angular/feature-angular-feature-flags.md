---
id: feature-angular-feature-flags
type: feature
status: proposed
created: 2026-06-13
package: '@hexguard/angular-feature-flags'
---

# Angular Feature Flags Package

## Summary

Design `@hexguard/angular-feature-flags` as a package for standardizing typed feature-flag checks
across routes, templates, page actions, and service logic.

The repeated problem is that feature checks quickly spread into raw string literals, nested `if`
conditions, and inconsistent rollout rules across Angular apps.

## Goals

- Standardize typed feature-flag evaluation in Angular apps.
- Support route, template, and imperative feature checks.
- Stay provider-agnostic so apps can adapt remote config, environment flags, or experimentation
  services.
- Keep the first version focused on evaluation, not analytics.

## Non-Goals

- Building a remote flag management service.
- Shipping experimentation dashboards or analytics.
- Replacing permissions or role-based access control.

## Decisions

- Prefer typed flag contracts over raw string lookups.
- Treat template and guard helpers as thin wrappers over a headless flag evaluator.
- Keep targeting and user-context rules explicit rather than hidden in opaque expressions.

## Proposed Public API

```ts
import {
  provideFeatureFlags,
  injectFlag,
  type FeatureFlagProvider,
} from '@hexguard/angular-feature-flags';

// Provider setup
const provider: FeatureFlagProvider = {
  getFlag: async (key) => {
    const res = await fetch(`/api/flags/${key}`);
    return res.json();
  },
  getAllFlags: async () => {
    const res = await fetch('/api/flags');
    return res.json();
  },
};

export const appProviders = [provideFeatureFlags(provider)];

// Component usage
const betaFlag = injectFlag('beta-feature');

betaFlag.isEnabled; // Signal<boolean>
betaFlag.variant; // Signal<string | null>
betaFlag.payload; // Signal<Record<string, string> | null>

// Route guards
const routes = [{ path: 'beta', canMatch: [flagMatch('beta-feature')], component: BetaComponent }];

// Template directive
// @if (flag('beta-feature').isEnabled()) { <beta-component /> }

// Dev overrides
// Set localStorage override: localStorage.setItem('flag:beta-feature', 'true')
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold `angular/packages/angular-feature-flags/`.
2. Add build/test scripts.

### Phase 1: Core Implementation

3. Define `FeatureFlagProvider` interface and `FlagDefinition` type.
4. Implement `injectFlag(key)` — returns signal-based flag state.
5. Implement `provideFeatureFlags()` — registers provider and loads flags.
6. Implement route guard helpers: `flagMatch(key)`, `flagActivate(key)`.
7. Implement local override support — check `localStorage` before provider.
8. Add unit tests for: flag evaluation, provider loading, cache, overrides, route guards, template usage, missing flag fallback.

### Phase 2: Demo & Docs

9. Add demo route showing flag-gated features, toggle simulation, override panel.
10. Add Playwright coverage.
11. Write docs.

### Phase 3: Release

12. Add verify script, release workflow.
13. Run validation gate.

## Validation

- `pnpm test:lib:feature-flags`.
- `pnpm test:e2e`.

## Validation

- Unit tests for flag evaluation and overrides.
- Route and template tests for feature gating.
- Demo coverage proving rollout-sensitive UI behavior.

## Follow-Ups

- Revisit overlap and composition with permissions once both packages exist.
- Decide whether experimentation-specific helpers deserve a separate package later.
