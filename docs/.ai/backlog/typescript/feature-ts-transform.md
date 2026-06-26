---
id: feature-ts-transform
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/ts-transform'
---

# @hexguard/ts-transform

## Summary

Typed data transformation pipeline — map, filter, rename, pick, omit, validate. For ETL flows, API normalization, data migration.

## Proposed Public API

```typescript
export interface TransformPipeline<TInput, TOutput> {
  map<U>(fn: (input: TOutput) => U): TransformPipeline<TInput, U>;
  rename<K extends string>(from: string, to: K): TransformPipeline<TInput, Omit<TOutput, string> & Record<K, unknown>>;
  pick<K extends keyof TOutput>(...keys: K[]): TransformPipeline<TInput, Pick<TOutput, K>>;
  omit<K extends keyof TOutput>(...keys: K[]): TransformPipeline<TInput, Omit<TOutput, K>>;
  filter(predicate: (item: TOutput) => boolean): TransformPipeline<TInput, TOutput>;
  validate(fn: (item: TOutput) => string[]): TransformPipeline<TInput, TOutput>;
  default<K extends keyof TOutput>(key: K, value: TOutput[K]): TransformPipeline<TInput, TOutput>;
  transform(input: TInput[]): { results: TOutput[]; errors: TransformError[] };
}

export interface TransformError { index: number; path: string; message: string; }
export function createTransform<T = Record<string, unknown>>(): TransformPipeline<T, T>;
```

## Implementation Plan

1. Create `ts/packages/ts-transform/`.
2. Implement typed pipeline builder.
3. Add tests.
4. Publish to npm.
