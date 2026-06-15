import { describe, expect, it } from 'vitest';

import { evaluatePermission } from './permission-evaluator';

describe('evaluatePermission', () => {
  it('allows requirements that satisfy all, any, and none checks across capabilities and roles', () => {
    const decision = evaluatePermission(
      {
        capabilities: ['orders.view', 'orders.manage', 'reports.export'],
        roles: ['admin', 'operator'],
      },
      {
        allCapabilities: ['orders.view', 'orders.manage'],
        anyCapabilities: ['reports.export', 'reports.audit'],
        noneCapabilities: ['orders.delete'],
        allRoles: ['admin'],
        anyRoles: ['reviewer', 'operator'],
        noneRoles: ['suspended'],
      },
    );

    expect(decision.allowed).toBe(true);
    expect(decision.failedRequirements).toEqual([]);
  });

  it('reports the failed requirement keys when access is denied', () => {
    const decision = evaluatePermission(
      {
        capabilities: ['orders.view'],
        roles: ['reviewer'],
      },
      {
        allCapabilities: ['orders.manage'],
        anyCapabilities: ['orders.view', 'reports.export'],
        noneCapabilities: ['orders.delete'],
        allRoles: ['reviewer'],
        anyRoles: ['admin', 'manager'],
        noneRoles: ['reviewer'],
      },
    );

    expect(decision.allowed).toBe(false);
    expect(decision.failedRequirements).toEqual(['allCapabilities', 'anyRoles', 'noneRoles']);
  });

  it('treats an empty requirement as allowed', () => {
    const decision = evaluatePermission({
      capabilities: ['orders.view'],
      roles: ['reviewer'],
    });

    expect(decision.allowed).toBe(true);
    expect(decision.failedRequirements).toEqual([]);
  });
});
