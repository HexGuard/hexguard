---
id: feature-angular-onboarding
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-onboarding'
---

# @hexguard/angular-onboarding

## Summary

Headless onboarding wizard state — welcome screen, setup steps (profile, team invite, preferences), completion. Distinct from `angular-tour` (product feature tour) — this is the **first-run account setup flow** for new users/tenants.

## Proposed Public API

```typescript
export function injectOnboarding(config: {
  steps: OnboardingStep[];
  onComplete: (data: Record<string, unknown>) => Promise<void>;
  persistKey?: string;
}): {
  readonly currentStep: Signal<number>; readonly totalSteps: Signal<number>;
  readonly step: Signal<OnboardingStep>; readonly data: Signal<Record<string, unknown>>;
  readonly completed/skipped/isCompleting: Signal<boolean>;
  next(): void; prev(): void; skip(): void;
  updateData(id: string, data: Record<string, unknown>): void; complete(): Promise<void>;
};

export interface OnboardingStep { id: string; title: string; description: string; skippable?: boolean; }
```

## Implementation Plan
1. Scaffold `angular/packages/angular-onboarding/`.
2. Implement multi-step setup wizard with persistence.
3. Add tests. Register in workspace.
