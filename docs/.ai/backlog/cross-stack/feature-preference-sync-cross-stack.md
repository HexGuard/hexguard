---
id: feature-preference-sync-cross-stack
type: feature
status: proposed
created: 2026-06-13
updated: 2026-06-17
package: 'HexGuard.PreferenceSync + @hexguard/angular-preferences'
---

# Preference Sync Cross-Stack Package Pair

## Summary

Design a coordinated `.NET + Angular` package pair for synchronizing user preferences such as saved filters, dashboard defaults, hidden columns, and preferred views.

Local preference state is common, but many products eventually need those settings to roam with the user. A shared contract would reduce drift between client preference models and backend storage or migration behavior.

## Goals

- Standardize a common preference contract across frontend and backend.
- Support saved views, dashboard defaults, hidden columns, and user-level settings.
- Compose with local-first Angular storage (`@hexguard/angular-storage`) while enabling server sync.
- Keep migrations and versioning explicit.

## Non-Goals

- A full settings management product.
- CMS-like user personalization.
- Authentication or user-profile systems.

## Decisions

- Prefer a local-first Angular package with optional server sync contract.
- Keep the sync pair explicit rather than hiding network behavior.
- Treat saved views and defaults as first-class preference scenarios.
- Use a flat key-value model with typed value schemas per key.

## Proposed Public API

### .NET

```csharp
public record UserPreference(string Key, string Value, int Version, DateTime UpdatedAtUtc);

public interface IPreferenceStore
{
    Task<UserPreference?> GetAsync(string userId, string key, CancellationToken ct);
    Task SetAsync(string userId, string key, string value, int version, CancellationToken ct);
    Task<IReadOnlyList<UserPreference>> GetAllAsync(string userId, CancellationToken ct);
}

// Endpoints
// GET  /api/preferences/{key}        → { key, value, version }
// PUT  /api/preferences/{key}        → body: { value, version }
// GET  /api/preferences              → all preferences
```

### Angular

```ts
import { injectPreference, injectPreferenceSync } from '@hexguard/angular-preferences';

// Local-first with optional sync
const theme = injectPreference('theme', {
  defaultValue: 'light',
  sync: true, // syncs to server when set
});

theme.value; // Signal<string>
theme.set('dark'); // updates locally + syncs to server
theme.syncStatus; // Signal<'synced' | 'pending' | 'error'>

// Batch
const sync = injectPreferenceSync();
sync.push(theme); // registers for sync
sync.syncAll(); // pushes all pending preferences
```

## Implementation Plan

### Phase 0: .NET — HexGuard.PreferenceSync

1. Scaffold project + tests under `dotnet/src/HexGuard.PreferenceSync/`.
2. Define `UserPreference` record, `IPreferenceStore` interface, `InMemoryPreferenceStore`.
3. Implement minimal-API endpoints for get/set/getAll.
4. Add unit tests and integration tests.

### Phase 1: Angular — @hexguard/angular-preferences

5. Scaffold `angular/packages/angular-preferences/`.
6. Implement `injectPreference()` with local-storage fallback and optional HTTP sync.
7. Implement `injectPreferenceSync()` for batch operations.
8. Add unit tests for: local get/set, sync push, version conflict, error recovery.

### Phase 2: Demo & Docs

9. Add .NET endpoint group to `HexGuard.SampleApi`.
10. Add Angular demo route showing preference editor with sync status.
11. Add Playwright coverage.
12. Write deep-dive docs.

### Phase 3: Release

13. Add build/test/verify scripts.
14. Add release workflows.
15. Run full validation gates.

## Validation

- `pnpm dotnet:test`.
- `pnpm test:lib:preferences`.
- `pnpm test:e2e`.
