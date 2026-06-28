---
id: feature-ts-event
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/ts-event'
---

# @hexguard/ts-event

## Summary

Typed event emitter / pub-sub for TypeScript â€” `EventEmitter<T>` with typed events, async listeners, `once`, and `Disposable` cleanup. Lighter than Node.js EventEmitter, typed unlike `mitt`.

**Competition check:** `mitt` (2M+ weekly) is popular but untyped. Node.js `EventEmitter` is heavy.


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
export interface EventMap { [event: string]: unknown; }

export interface TypedEmitter<T extends EventMap> {
  on<K extends keyof T>(event: K, listener: (data: T[K]) => void | Promise<void>): Disposable;
  once<K extends keyof T>(event: K, listener: (data: T[K]) => void | Promise<void>): void;
  off<K extends keyof T>(event: K, listener: (data: T[K]) => void | Promise<void>): void;
  emit<K extends keyof T>(event: K, data: T[K]): Promise<void>;
  listenerCount<K extends keyof T>(event: K): number;
  removeAllListeners(): void;
}

export function createEmitter<T extends EventMap>(): TypedEmitter<T>;

// Usage
interface MyEvents {
  'user:login': { userId: string; timestamp: Date };
  'error': { message: string; code: number };
}
const bus = createEmitter<MyEvents>();
const d = bus.on('user:login', async (data) => console.log(data.userId));
await bus.emit('user:login', { userId: '42', timestamp: new Date() });
// d[Symbol.dispose]() â€” auto-cleanup
```

## Implementation Plan

1. Create `ts/packages/ts-event/`.
2. Implement `TypedEmitter` with sync/async listener support.
3. Implement `Disposable` integration.
4. Add tests.
5. Publish to npm.
