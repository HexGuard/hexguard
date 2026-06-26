---
id: feature-angular-graphql
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-graphql'
---

# @hexguard/angular-graphql

## Summary

Headless GraphQL client state — queries/mutations/subscriptions as signals. Lighter than Apollo Angular.

## Proposed Public API

```typescript
export function injectGraphqlClient(config: {
  endpoint: string;
  headers?: Signal<Record<string, string>>;
  cache?: { ttl?: number };
}): {
  query<T>(document: string, vars?: Record<string, unknown>): {
    readonly loading: Signal<boolean>; readonly data: Signal<T | null>;
    readonly error: Signal<GraphqlError[] | null>; refetch(): Promise<void>;
  };
  mutate<T>(document: string, vars?: Record<string, unknown>): Promise<{ data: T | null; errors: GraphqlError[] | null }>;
  subscribe<T>(document: string, vars?: Record<string, unknown>): {
    readonly data: Signal<T | null>; readonly error: Signal<GraphqlError[] | null>; unsubscribe(): void;
  };
};
```

## Implementation Plan

1. Scaffold `angular/packages/angular-graphql/`.
2. Implement query/mutation/subscription with signal state.
3. Add in-memory cache.
4. Add tests.
5. Register in workspace.
