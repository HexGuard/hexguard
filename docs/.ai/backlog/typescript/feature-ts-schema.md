---
id: feature-ts-schema
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/ts-schema'
---

# @hexguard/ts-schema

## Summary

JSON Schema â†’ TypeScript type inference + runtime validation. Define schemas with full type inference and validate unknown data.


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
export function defineSchema<T extends SchemaDefinition>(schema: T): Schema<T>;

const UserSchema = defineSchema({
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number', minimum: 0 },
    role: { type: 'union', values: ['admin', 'user'] as const },
  },
  required: ['name'] as const,
});

type User = Infer<typeof UserSchema>;  // { name: string; age?: number; role?: 'admin' | 'user' }
const result = UserSchema.validate(data);  // { ok: boolean; value?: User; errors: ValidationError[] }
```

## Implementation Plan

1. Create `ts/packages/ts-schema/`.
2. Implement schema definition with type inference.
3. Implement runtime validation.
4. Add tests.
5. Publish to npm.
