---
id: feature-angular-sync
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-sync'
---

# @hexguard/angular-sync

## Summary

Sync state management for Angular — track local pending changes, push to server, pull remote changes, handle conflicts. For offline-first apps that queue mutations locally and sync when online.

**Competition check:** No headless Angular sync state package exists. Offline sync is always built from scratch.

## Goals

1. Provide `injectSync()` — sync state with push/pull and conflict resolution.
2. Track pending changes count and sync status.
3. Support conflict detection and resolution (local wins / remote wins / merge).
4. Expose signals: `status`, `pendingCount`, `lastSyncedAt`, `error`, `conflicts`.

## Proposed Public API

```typescript
export interface SyncConfig {
  push: (pending: PendingChange[]) => Promise<SyncResult[]>;
  pull: (since: Date) => Promise<RemoteChange[]>;
  conflictResolver?: (local: unknown, remote: unknown) => unknown;
}

export function injectSync(config: SyncConfig): {
  readonly status: Signal<'idle' | 'syncing' | 'synced' | 'error' | 'conflict'>;
  readonly pendingCount: Signal<number>;
  readonly lastSyncedAt: Signal<Date | null>;
  readonly error: Signal<string | null>;
  readonly conflicts: Signal<Conflict[]>;

  trackChange<T>(entityType: string, entityId: string, change: Partial<T>): void;
  sync(): Promise<void>;
  resolveConflict(conflictId: string, resolution: 'local' | 'remote' | unknown): void;
};
```

## Implementation Plan

1. Scaffold `angular/packages/angular-sync/`.
2. Implement pending change tracking, push/pull engine, conflict detection.
3. Add tests.
4. Register in workspace.
