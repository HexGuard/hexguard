import { describe, expect, it } from 'vitest';

import { evaluateFeatureFlag, evaluateFeatureFlags } from './feature-flag-evaluator';
import type { FeatureFlag } from './types';

const defaultFlag: FeatureFlag = {
  key: 'feature-x',
  enabled: true,
  variant: 'enabled',
  rolloutPercentage: 100,
  targetingRules: [],
  metadata: null,
};

const defaultContext = {
  userId: 'user-42',
  tenantId: 'tenant-1',
  groups: ['beta-testers', 'employees'],
  attributes: { region: 'us-east', tier: 'premium' },
};

describe('evaluateFeatureFlag', () => {
  it('returns disabled for a disabled flag', () => {
    const result = evaluateFeatureFlag({ ...defaultFlag, enabled: false }, defaultContext);
    expect(result.enabled).toBe(false);
    expect(result.variant).toBe('disabled');
    expect(result.matchedRule).toBeNull();
  });

  it('returns enabled for enabled flag with no rules and full rollout', () => {
    const result = evaluateFeatureFlag(defaultFlag, defaultContext);
    expect(result.enabled).toBe(true);
    expect(result.variant).toBe('enabled');
    expect(result.matchedRule).toBeNull();
  });

  it('returns enabled for always rule', () => {
    const flag: FeatureFlag = { ...defaultFlag, targetingRules: [{ type: 'always' }] };
    const result = evaluateFeatureFlag(flag, defaultContext);
    expect(result.enabled).toBe(true);
    expect(result.matchedRule).toBe('always');
  });

  it('returns disabled for never rule', () => {
    const flag: FeatureFlag = { ...defaultFlag, targetingRules: [{ type: 'never' }] };
    const result = evaluateFeatureFlag(flag, defaultContext);
    expect(result.enabled).toBe(false);
    expect(result.matchedRule).toBe('never');
  });

  it('matches via userIn rule', () => {
    const flag: FeatureFlag = {
      ...defaultFlag,
      targetingRules: [{ type: 'userIn', users: ['user-42', 'user-99'] }],
    };
    const result = evaluateFeatureFlag(flag, defaultContext);
    expect(result.enabled).toBe(true);
    expect(result.matchedRule).toBe('userIn');
  });

  it('does not match userIn for different user', () => {
    const flag: FeatureFlag = {
      ...defaultFlag,
      targetingRules: [{ type: 'userIn', users: ['user-99'] }],
    };
    const result = evaluateFeatureFlag(flag, { userId: 'other-user' });
    expect(result.enabled).toBe(false);
  });

  it('excludes via userNotIn rule', () => {
    const flag: FeatureFlag = {
      ...defaultFlag,
      targetingRules: [{ type: 'userNotIn', users: ['user-42'] }],
    };
    const result = evaluateFeatureFlag(flag, defaultContext);
    expect(result.enabled).toBe(false);
  });

  it('allows via userNotIn for different user', () => {
    const flag: FeatureFlag = {
      ...defaultFlag,
      targetingRules: [{ type: 'userNotIn', users: ['user-99'] }],
    };
    const result = evaluateFeatureFlag(flag, defaultContext);
    expect(result.enabled).toBe(true);
    expect(result.matchedRule).toBe('userNotIn');
  });

  it('matches via groupIn rule', () => {
    const flag: FeatureFlag = {
      ...defaultFlag,
      targetingRules: [{ type: 'groupIn', groups: ['beta-testers'] }],
    };
    const result = evaluateFeatureFlag(flag, defaultContext);
    expect(result.enabled).toBe(true);
    expect(result.matchedRule).toBe('groupIn');
  });

  it('does not match groupIn for non-member', () => {
    const flag: FeatureFlag = {
      ...defaultFlag,
      targetingRules: [{ type: 'groupIn', groups: ['alpha-testers'] }],
    };
    const result = evaluateFeatureFlag(flag, defaultContext);
    expect(result.enabled).toBe(false);
  });

  it('excludes via groupNotIn rule', () => {
    const flag: FeatureFlag = {
      ...defaultFlag,
      targetingRules: [{ type: 'groupNotIn', groups: ['beta-testers'] }],
    };
    const result = evaluateFeatureFlag(flag, defaultContext);
    expect(result.enabled).toBe(false);
  });

  it('allows via groupNotIn for non-member', () => {
    const flag: FeatureFlag = {
      ...defaultFlag,
      targetingRules: [{ type: 'groupNotIn', groups: ['alpha-testers'] }],
    };
    const result = evaluateFeatureFlag(flag, defaultContext);
    expect(result.enabled).toBe(true);
    expect(result.matchedRule).toBe('groupNotIn');
  });

  it('matches via attributeMatch rule', () => {
    const flag: FeatureFlag = {
      ...defaultFlag,
      targetingRules: [{ type: 'attributeMatch', attribute: 'region', value: 'us-east' }],
    };
    const result = evaluateFeatureFlag(flag, defaultContext);
    expect(result.enabled).toBe(true);
    expect(result.matchedRule).toBe('attributeMatch');
  });

  it('does not match attributeMatch for different value', () => {
    const flag: FeatureFlag = {
      ...defaultFlag,
      targetingRules: [{ type: 'attributeMatch', attribute: 'region', value: 'eu-west' }],
    };
    const result = evaluateFeatureFlag(flag, defaultContext);
    expect(result.enabled).toBe(false);
  });

  it('excludes via attributeNotMatch rule', () => {
    const flag: FeatureFlag = {
      ...defaultFlag,
      targetingRules: [{ type: 'attributeNotMatch', attribute: 'region', value: 'us-east' }],
    };
    const result = evaluateFeatureFlag(flag, defaultContext);
    expect(result.enabled).toBe(false);
  });

  it('allows via attributeNotMatch for different value', () => {
    const flag: FeatureFlag = {
      ...defaultFlag,
      targetingRules: [{ type: 'attributeNotMatch', attribute: 'region', value: 'eu-west' }],
    };
    const result = evaluateFeatureFlag(flag, defaultContext);
    expect(result.enabled).toBe(true);
    expect(result.matchedRule).toBe('attributeNotMatch');
  });

  it('first-match-wins: userIn before never', () => {
    const flag: FeatureFlag = {
      ...defaultFlag,
      targetingRules: [
        { type: 'userIn', users: ['user-42'] },
        { type: 'never' },
      ],
    };
    const result = evaluateFeatureFlag(flag, defaultContext);
    expect(result.enabled).toBe(true);
    expect(result.matchedRule).toBe('userIn');
  });

  it('rollout at 0% is always disabled', () => {
    const flag: FeatureFlag = {
      ...defaultFlag,
      targetingRules: [{ type: 'rollout', percentage: 0 }],
    };
    const result = evaluateFeatureFlag(flag, defaultContext);
    expect(result.enabled).toBe(false);
  });

  it('rollout at 100% is always enabled', () => {
    const flag: FeatureFlag = {
      ...defaultFlag,
      targetingRules: [{ type: 'rollout', percentage: 100 }],
    };
    const result = evaluateFeatureFlag(flag, defaultContext);
    expect(result.enabled).toBe(true);
    expect(result.matchedRule).toBe('rollout');
  });

  it('returns custom variant from flag', () => {
    const flag: FeatureFlag = {
      ...defaultFlag,
      variant: 'dark',
      targetingRules: [{ type: 'always' }],
    };
    const result = evaluateFeatureFlag(flag, defaultContext);
    expect(result.variant).toBe('dark');
  });

  it('handles null groups gracefully', () => {
    const flag: FeatureFlag = {
      ...defaultFlag,
      targetingRules: [{ type: 'groupIn', groups: ['beta-testers'] }],
    };
    const result = evaluateFeatureFlag(flag, { userId: 'user-42' });
    expect(result.enabled).toBe(false);
  });

  it('handles null attributes gracefully', () => {
    const flag: FeatureFlag = {
      ...defaultFlag,
      targetingRules: [{ type: 'attributeMatch', attribute: 'region', value: 'us-east' }],
    };
    const result = evaluateFeatureFlag(flag, { userId: 'user-42' });
    expect(result.enabled).toBe(false);
  });
});

describe('evaluateFeatureFlags', () => {
  it('evaluates multiple flags concurrently', () => {
    const flags: FeatureFlag[] = [
      { ...defaultFlag, key: 'flag-a', targetingRules: [{ type: 'always' }] },
      { ...defaultFlag, key: 'flag-b', targetingRules: [{ type: 'never' }] },
      { ...defaultFlag, key: 'flag-c', enabled: false },
    ];

    const { results } = evaluateFeatureFlags(flags, defaultContext);
    const byKey = Object.fromEntries(results.map((r) => [r.key, r]));
    expect(Object.keys(byKey)).toHaveLength(3);
    expect(byKey['flag-a'].enabled).toBe(true);
    expect(byKey['flag-b'].enabled).toBe(false);
    expect(byKey['flag-c'].enabled).toBe(false);
  });

  it('handles empty flags array', () => {
    const { results } = evaluateFeatureFlags([], defaultContext);
    expect(results).toHaveLength(0);
  });

  it('handles empty userId without crashing', () => {
    const flag: FeatureFlag = {
      ...defaultFlag,
      rolloutPercentage: 50,
      targetingRules: [{ type: 'rollout', percentage: 50 }],
    };
    const result = evaluateFeatureFlag(flag, { userId: '' });
    expect(result.key).toBe('feature-x');
  });

  it('clamps rollout percentage above 100 to enabled', () => {
    const flag: FeatureFlag = {
      ...defaultFlag,
      rolloutPercentage: 200,
    };
    const result = evaluateFeatureFlag(flag, defaultContext);
    expect(result.enabled).toBe(true);
  });

  it('clamps rollout percentage below 0 to disabled', () => {
    const flag: FeatureFlag = {
      ...defaultFlag,
      rolloutPercentage: -10,
    };
    const result = evaluateFeatureFlag(flag, defaultContext);
    expect(result.enabled).toBe(false);
  });
});
