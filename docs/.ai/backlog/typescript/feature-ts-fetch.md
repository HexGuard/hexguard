---
id: feature-ts-fetch
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/ts-fetch'
---

# @hexguard/ts-fetch

## Summary

Typed fetch wrapper for TypeScript â€” request/response interceptors, timeout, retry (composes with `@hexguard/ts-retry`), base URL, and typed JSON responses. Every TypeScript project wraps `fetch()` with these features.

**Competition check:** `ky`, `got`, `axios` are popular but opinionated. `ofetch` is lightweight but lacks interceptor chaining. This is a **minimal** typed wrapper around `fetch()` with interceptors, timeout, and retry composition.

## Goals

1. Provide `createFetch(options)` â€” typed fetch wrapper.
2. Support request and response interceptors (for auth, logging, error mapping).
3. Support configurable timeout via `AbortController`.
4. Support `retry` integration with `@hexguard/ts-retry`.
5. Return `Result<T, FetchError>` for functional error handling.
6. Zero dependencies (except optional ts-retry peer dep).


## Goals

- Provide zero-dependency, tree-shakeable pure functions
- Full TypeScript generics with strict type safety
- Compatible with browser and Node.js runtimes

## Non-Goals

- No runtime dependencies
- No framework-specific integrations
- No server-side or platform-specific features

## Proposed Public API

```typescript
export interface FetchConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
  timeout?: number;
  retry?: RetryOptions;            // From @hexguard/ts-retry
}

export interface FetchInterceptor {
  onRequest?: (req: RequestInit & { url: string }) => RequestInit & { url: string } | Promise<...>;
  onResponse?: <T>(res: Response, data: T) => T | Promise<T>;
  onError?: (error: unknown) => unknown;
}

export function createFetch(config?: FetchConfig): {
  get<T>(url: string, options?: RequestInit): Promise<T>;
  post<T>(url: string, body: unknown, options?: RequestInit): Promise<T>;
  put<T>(url: string, body: unknown, options?: RequestInit): Promise<T>;
  patch<T>(url: string, body: unknown, options?: RequestInit): Promise<T>;
  delete<T>(url: string, options?: RequestInit): Promise<T>;

  // Add/remove interceptors at runtime
  interceptor: {
    request: { use(fn: RequestInterceptor): number; eject(id: number): void };
    response: { use<T>(fn: ResponseInterceptor<T>): number; eject(id: number): void };
  };
};

// Usage
const api = createFetch({
  baseUrl: 'https://api.example.com',
  timeout: 10_000,
  retry: { maxAttempts: 3, strategy: exponential(100) },
});

api.interceptor.request.use(async (req) => ({
  ...req,
  headers: { ...req.headers, Authorization: `Bearer ${getToken()}` },
}));

const users = await api.get<User[]>('/users');
```

## Implementation Plan

1. Create `ts/packages/ts-fetch/`.
2. Implement `createFetch` with interceptors, timeout, retry.
3. Add tests.
4. Publish to npm.
