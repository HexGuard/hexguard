---
id: feature-angular-smoke-test
type: feature
status: proposed
created: 2026-06-30
package: '@hexguard/angular-smoke-test'
---

# @hexguard/angular-smoke-test

## Summary

Headless smoke test runner — define critical-path checks, run them post-deploy, and display results. For verifying deployments succeeded before declaring them healthy.

## Pain Point

After every deploy, someone manually clicks through the app checking: "Does the login page load? Can users log in? Does the dashboard render? Are API calls working?" This is slow, inconsistent, and error-prone. Automated E2E tests exist but aren't run as a post-deploy smoke suite with clear pass/fail signals.

## Goals

- Declarative smoke test definitions (page loads, API calls, element presence)
- Sequential and parallel execution modes
- Pass/fail/timeout results with timing
- Post-deploy trigger (run after deployment)
- Results persistence for comparison across deploys
- Timeout and retry per test
- CI-friendly JSON output

## Non-Goals

- No rendered smoke test UI
- No E2E test framework replacement
- No visual regression testing

## Proposed Public API

```typescript
export function injectSmokeTest(config: {
  tests: SmokeTest[];
  timeout?: number;
  retries?: number;
  parallel?: boolean;
}): {
  readonly results: Signal<SmokeTestResult[]>;
  readonly status: Signal<'idle' | 'running' | 'passed' | 'failed' | 'timed-out'>;
  readonly progress: Signal<{ passed: number; failed: number; total: number }>;
  run(): Promise<SmokeTestResult[]>;
  runSingle(name: string): Promise<SmokeTestResult>;
};

export interface SmokeTest {
  name: string;
  category: string;
  critical: boolean;
  checks: SmokeCheck[];
}

export type SmokeCheck =
  | { type: 'page-load'; url: string; expectedTitle?: string }
  | { type: 'api-call'; url: string; method?: string; expectedStatus?: number }
  | { type: 'element-exists'; selector: string; timeout?: number }
  | { type: 'console-no-errors' }
  | { type: 'custom'; name: string; execute: () => Promise<boolean> };

export interface SmokeTestResult {
  testName: string;
  checkResults: { checkType: string; passed: boolean; durationMs: number; error?: string }[];
  passed: boolean;
  durationMs: number;
  timestamp: Date;
  deployVersion?: string;
}

// Usage
const smoke = injectSmokeTest({
  tests: [
    { name: 'Login Flow', category: 'auth', critical: true, checks: [
      { type: 'page-load', url: '/login', expectedTitle: 'Sign In' },
      { type: 'api-call', url: '/api/health', expectedStatus: 200 }
    ]},
    { name: 'Dashboard', category: 'core', critical: true, checks: [
      { type: 'page-load', url: '/dashboard' },
      { type: 'element-exists', selector: '[data-testid=dashboard-grid]' }
    ]}
  ]
});

const results = await smoke.run();
// { passed: 2, failed: 0, total: 2 }
```

## Implementation Plan
1. Scaffold `angular/packages/angular-smoke-test/`.
2. Implement test runner, result aggregation, post-deploy trigger.
3. Add parallel execution, retry, timeout, CI output.
4. Add tests. Register in workspace.
