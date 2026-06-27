---
id: feature-angular-testing
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-testing'
---

# @hexguard/angular-testing

## Summary

Signal testing utilities and component test helpers — `createTestSignal`, `mockHttp`, `mockStorage`, `mockInjector`. **Promoted from sidenote.** Accelerates all HexGuard package and consumer app testing.

## Proposed Public API

```typescript
// Signal testing
export function createTestSignal<T>(initial: T): WritableSignal<T> & { history(): T[]; reset(): void };
export function signalSpy<T>(s: Signal<T>): { values(): T[]; called(): number; lastValue(): T };

// HTTP mock
export function mockHttp(): { expect: { get/post/put/delete }; flush: (response: unknown) => void; error: (err: unknown) => void; requests: () => MockRequest[] };

// Storage mock
export function mockStorage(): Storage & { getAll(): Record<string, string>; reset(): void };

// Test harness
export function createComponentHarness<T>(component: Type<T>): { render: (inputs?: Partial<T>) => Promise<HarnessInstance<T>> };
```

## Implementation Plan
1. Scaffold `angular/packages/angular-testing/`.
2. Implement signal spies, HTTP mock, storage mock, component harness.
3. Add tests. Register in workspace.
