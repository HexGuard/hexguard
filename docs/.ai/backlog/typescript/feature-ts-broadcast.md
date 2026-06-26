---
id: feature-ts-broadcast
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/ts-broadcast'
---

# @hexguard/ts-broadcast

## Summary

BroadcastChannel API wrapper for TypeScript — typed cross-tab/window/iframe communication. Every app that opens multiple tabs (admin panels, dashboards) needs cross-tab sync for auth state, theme changes, and data refresh.

**Competition check:** No popular typed BroadcastChannel abstraction exists.

## Proposed Public API

```typescript
export function createBroadcast<T>(channel: string): {
  send(data: T): void;
  onMessage(listener: (data: T) => void): Disposable;
  close(): void;
};

// Usage
const bc = createBroadcast<{ type: 'auth:logout' } | { type: 'theme:change'; theme: string }>('app-events');
bc.send({ type: 'theme:change', theme: 'dark' });
const d = bc.onMessage((msg) => { /* handle */ });
```

## Implementation Plan

1. Create `ts/packages/ts-broadcast/`.
2. Implement `createBroadcast()` wrapping `BroadcastChannel` API.
3. Add typed send/receive with `Disposable` cleanup.
4. Add tests.
5. Publish to npm.
