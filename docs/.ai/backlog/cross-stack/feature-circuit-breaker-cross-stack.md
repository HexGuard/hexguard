---
id: feature-circuit-breaker-cross-stack
type: feature
status: proposed
created: 2026-06-26
package: 'HexGuard.CircuitBreaker + @hexguard/angular-circuit-breaker'
---

# Circuit Breaker Cross-Stack Package Pair

## Summary

A coordinated .NET + Angular package pair for circuit breaker resilience — the .NET side provides a circuit breaker for protecting downstream HTTP calls; the Angular side provides a client-side circuit breaker for API calls.

**Promoted from .NET sidenote** and an Angular counterpart is added.

## Why Wide Adoption

Circuit breakers prevent cascading failures: when a downstream service is failing, stop calling it (open circuit), try occasionally (half-open), resume when healthy (closed). Essential for distributed system resilience.

## Goals

### .NET (`HexGuard.CircuitBreaker`) — extend existing sidenote

1. Provide `ICircuitBreaker` with open/half-open/closed states and configurable thresholds.
2. Integrate with `IHttpClientFactory` as a `DelegatingHandler`.

### Angular (`@hexguard/angular-circuit-breaker`)

1. Provide `injectCircuitBreaker()` — client-side circuit breaker state.
2. Expose signals: `state`, `failureCount`, `isOpen`.
3. Provide `call()` method — rejects immediately if circuit is open.
4. Support configurable failure threshold and reset timeout.

## Proposed Public API

### Angular

```typescript
export function injectCircuitBreaker(config: {
  failureThreshold: number;     // Open after N consecutive failures
  resetTimeoutMs: number;       // Try half-open after this time
  halfOpenMaxRequests?: number; // Max requests in half-open state
}): {
  readonly state: Signal<'closed' | 'open' | 'half-open'>;
  readonly failureCount: Signal<number>;
  readonly isOpen: Signal<boolean>;
  call<T>(fn: () => Promise<T>): Promise<T>;
  callSuccess(): void;
  callFailure(): void;
  reset(): void;
};
```

### .NET

```csharp
public interface ICircuitBreaker
{
    CircuitState State { get; }
    int FailureCount { get; }
    bool IsOpen { get; }

    Task<TResult> ExecuteAsync<TResult>(Func<Task<TResult>> action,
        Func<Task<TResult>>? fallback = null, CancellationToken ct = default);
    void Reset();
}

public enum CircuitState { Closed, Open, HalfOpen }
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.CircuitBreaker/` with standard `.csproj`.
2. Implement circuit breaker with open/half-open/closed state machine.
3. Create Angular package with `injectCircuitBreaker()`.
4. Add tests on both sides.
5. Register both packages.
