import { Injectable, computed, signal } from '@angular/core';

import { evaluateFeatureFlag } from '@hexguard/angular-feature-flags';
import type { FeatureFlag, FlagEvaluationContext } from '@hexguard/angular-feature-flags';

export type FeatureFlagDemoPersonaId =
  | 'guest'
  | 'beta-tester'
  | 'premium'
  | 'dark-mode-user'
  | 'admin';

export interface FeatureFlagDemoPersona {
  readonly id: FeatureFlagDemoPersonaId;
  readonly label: string;
  readonly summary: string;
  readonly context: FlagEvaluationContext;
}

export const FEATURE_FLAG_DEMO_PERSONAS: readonly FeatureFlagDemoPersona[] = [
  {
    id: 'guest',
    label: 'Guest',
    summary: 'Has no special groups or attributes. Sees only flags with broad rollout.',
    context: { userId: 'guest-1' },
  },
  {
    id: 'beta-tester',
    label: 'Beta Tester',
    summary: 'Member of beta-testers group. Sees beta-search with 100% via group rule.',
    context: { userId: 'beta-user-1', groups: ['beta-testers'] },
  },
  {
    id: 'premium',
    label: 'Premium User',
    summary: 'Member of premium-users group. Sees premium-feature-x.',
    context: { userId: 'premium-user-1', groups: ['premium-users'] },
  },
  {
    id: 'dark-mode-user',
    label: 'Dark Mode User',
    summary: 'Has preferences=dark-mode attribute. Sees dark-mode flag.',
    context: {
      userId: 'dark-user-1',
      attributes: { preferences: 'dark-mode' },
    },
  },
  {
    id: 'admin',
    label: 'Admin',
    summary: 'Full access — member of all groups, sees all flags enabled.',
    context: {
      userId: 'admin-1',
      groups: ['beta-testers', 'premium-users'],
      attributes: { preferences: 'dark-mode' },
    },
  },
];

/** Demo flag definitions matching the .NET SampleApi. */
export const FEATURE_FLAG_DEMO_CATALOG: { flags: Record<string, FeatureFlag>; contextHash: string } = {
  flags: {
    'beta-search': {
      key: 'beta-search',
      enabled: true,
      variant: 'search-v2',
      rolloutPercentage: 100,
      targetingRules: [
        { type: 'groupIn' as const, groups: ['beta-testers'] },
        { type: 'rollout' as const, percentage: 25 },
      ],
      metadata: { description: 'Beta version of search with improved relevance' },
    },
    'new-checkout': {
      key: 'new-checkout',
      enabled: true,
      variant: 'checkout-v2',
      rolloutPercentage: 100,
      targetingRules: [
        { type: 'userIn' as const, users: ['admin-1', 'admin-2'] },
        { type: 'rollout' as const, percentage: 10 },
      ],
      metadata: { description: 'Redesigned checkout flow' },
    },
    'dark-mode': {
      key: 'dark-mode',
      enabled: true,
      variant: 'dark',
      rolloutPercentage: 100,
      targetingRules: [
        { type: 'attributeMatch' as const, attribute: 'preferences', value: 'dark-mode' },
      ],
      metadata: { description: 'Dark mode theme toggle' },
    },
    'premium-feature-x': {
      key: 'premium-feature-x',
      enabled: true,
      variant: 'premium',
      rolloutPercentage: 100,
      targetingRules: [
        { type: 'groupIn' as const, groups: ['premium-users'] },
      ],
      metadata: { description: 'Exclusive premium feature' },
    },
    'deprecated-ui': {
      key: 'deprecated-ui',
      enabled: false,
      variant: 'deprecated',
      rolloutPercentage: 0,
      targetingRules: [],
      metadata: {
        description: 'Legacy UI - deprecated',
        deprecationDate: '2026-09-01',
      },
    },
  },
  contextHash: 'demo-static-hash',
};

@Injectable({ providedIn: 'root' })
export class FeatureFlagsDemoSessionService {
  readonly personas = FEATURE_FLAG_DEMO_PERSONAS;
  readonly personaId = signal<FeatureFlagDemoPersonaId>('guest');
  readonly persona = computed(
    () => this.personas.find((p) => p.id === this.personaId()) ?? this.personas[0],
  );
  readonly context = computed(() => this.persona().context);

  /** Per-flag override toggles for demo purposes.
   *  When set, bypasses evaluation and forces a flag on/off. */
  readonly flagOverrides = signal<Record<string, boolean | null>>({});

  setPersona(id: string): void {
    const match = this.personas.find((p) => p.id === id);
    if (match) {
      this.personaId.set(match.id);
      // Clear overrides on persona switch
      this.flagOverrides.set({});
    }
  }

  toggleOverride(flagKey: string): void {
    this.flagOverrides.update((overrides) => {
      const current = overrides[flagKey];
      if (current === true) {
        return { ...overrides, [flagKey]: false };
      }
      if (current === false) {
        const { [flagKey]: _, ...rest } = overrides;
        return rest;
      }
      return { ...overrides, [flagKey]: true };
    });
  }

  getEffectiveResult(flag: FeatureFlag): { enabled: boolean; variant: string } {
    const override = this.flagOverrides()[flag.key];
    if (override === true) {
      return { enabled: true, variant: flag.variant };
    }
    if (override === false) {
      return { enabled: false, variant: 'disabled' };
    }
    const result = evaluateFeatureFlag(flag, this.context());
    return { enabled: result.enabled, variant: result.variant };
  }
}
