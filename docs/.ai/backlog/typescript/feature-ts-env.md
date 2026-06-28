---
id: feature-ts-env
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/ts-env'
---

# @hexguard/ts-env

## Summary

Typed environment configuration loading with validation â€” read from `process.env`, `.env` files, or injected values. Validates at startup â€” fails fast with clear errors.


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
export interface EnvSchema {
  [key: string]: { type: 'string' | 'number' | 'boolean' | 'union'; required?: boolean; default?: unknown; values?: string[] };
}

export function loadEnv<T>(schema: EnvSchema): T;

const config = loadEnv({
  PORT: { type: 'number', default: 3000 },
  DATABASE_URL: { type: 'string', required: true },
  LOG_LEVEL: { type: 'union', values: ['debug', 'info', 'warn', 'error'], default: 'info' },
});
// config.PORT is number, config.DATABASE_URL is string â€” typed!
```

## Implementation Plan

1. Create `ts/packages/ts-env/`.
2. Implement schema-based loading + validation.
3. Add `.env` file support.
4. Add tests.
5. Publish to npm.
