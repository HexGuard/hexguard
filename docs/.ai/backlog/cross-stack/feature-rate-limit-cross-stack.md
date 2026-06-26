---
id: feature-rate-limit-cross-stack
type: feature
status: proposed
created: 2026-06-25
package: 'HexGuard.RateLimiting + @hexguard/angular-rate-limit'
---

# Rate-Limit Cross-Stack Package Pair

## Summary

A coordinated .NET + Angular package pair (`HexGuard.RateLimiting` + `@hexguard/angular-rate-limit`) for standardized rate-limit response headers on the server side and client-side rate-limit awareness on the Angular side. The server sends `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` headers (RFC draft standard); the Angular client reads them and provides cooldown signals, automatic request pausing, and user-facing rate-limit warnings.

**Relationship to existing `HexGuard.RateLimiting` planned brief:** The existing `.NET` RateLimiting brief (in backlog) focuses on server-side policy conventions, endpoint configuration, and standard response headers. This cross-stack brief **completes the story** by defining the Angular client-side counterpart and the shared header contract between them.

## Why Wide Adoption

Rate limiting exists in nearly every production API. The client needs to know when it's being rate-limited, how many requests remain, and when the limit resets — not just get a `429 Too Many Requests` response. An Angular package that reads rate-limit headers and provides reactive cooldown signals prevents pointless retries, improves UX, and builds API-aware client logic.

## Goals

### .NET (`HexGuard.RateLimiting` — extending the existing brief)

1. Send standard `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` headers on every response.
2. Support configurable header names (for non-standard proxies/CDNs).
3. Provide `IRateLimitContext` injectable service for reading the current rate-limit state in handlers.

### Angular (`@hexguard/angular-rate-limit`)

1. Provide `injectRateLimit()` — reads rate-limit headers from HTTP responses and tracks budget.
2. Expose signals: `remaining`, `limit`, `resetAt`, `isLimited`, `cooldownSeconds`.
3. Provide an `HTTP_INTERCEPTOR` that auto-extracts headers from all responses.
4. Support retry-after countdown with signal updates every second.
5. Provide `withRateLimit()` — a higher-order function that wraps API calls to auto-pause when rate-limited and resume after reset.

## Non-Goals

- No client-side rate-limit enforcement (server is the source of truth; the client respects the server's signals).
- No request queuing or retry logic (consumer builds their own with `angular-async-state`).

## Decisions

1. **Header standards**: Follows the `RateLimit-*` draft RFC (https://datatracker.ietf.org/doc/draft-ietf-httpapi-ratelimit-headers/).
2. **Interceptor-based extraction**: An Angular `HttpInterceptor` reads headers from every response and feeds them to the shared rate-limit state.
3. **Independent releases**: Angular and .NET packages can version independently since the header contract is standardized.

## Proposed API

### .NET — Header Output

```csharp
// Extends the existing HexGuard.RateLimiting plan with:
public sealed class RateLimitHeaderOptions
{
    public string LimitHeader { get; set; } = "RateLimit-Limit";
    public string RemainingHeader { get; set; } = "RateLimit-Remaining";
    public string ResetHeader { get; set; } = "RateLimit-Reset";
    public string RetryAfterHeader { get; set; } = "Retry-After";
}
```

### Angular — Client State

```typescript
// ── Service ───────────────────────────────────────────────

export interface RateLimitState {
  readonly limit: Signal<number | null>;
  readonly remaining: Signal<number | null>;
  readonly resetAt: Signal<Date | null>;
  readonly isLimited: Signal<boolean>;
  readonly cooldownSeconds: Signal<number>;     // Counts down every second
  readonly retryAfter: Signal<number | null>;   // From Retry-After header

  /** Call from interceptor or manually after each API response */
  updateFromHeaders(headers: { get(name: string): string | null }): void;
  /** Reset state (e.g., on logout) */
  reset(): void;
}

// ── Factory ───────────────────────────────────────────────

export function injectRateLimit(): RateLimitState;

// ── Interceptor ───────────────────────────────────────────

export function provideRateLimitInterceptor(): Provider;

// ── Higher-order wrapper ──────────────────────────────────

export function withRateLimit<T>(
  call: () => Observable<T> | Promise<T>
): Observable<T>;
// Pauses execution when rate-limited, waits for reset, then retries once.
```

## Implementation Plan

1. **.NET side:** Extend the existing `HexGuard.RateLimiting` brief with header output middleware and `IRateLimitContext`.
2. **Angular side:**
   - Scaffold `angular/packages/angular-rate-limit/` following the standard pattern.
   - Implement `RateLimitState` with signals and timer-based cooldown counting.
   - Implement `HttpInterceptor` that extracts headers.
   - Implement `withRateLimit()` auto-pause wrapper.
3. Add tests: header extraction, cooldown countdown, interceptor integration, edge cases (missing headers, malformed header values).
4. Create demo page showing cooldown countdown.
5. Register in workspace, build scripts, and catalog.
