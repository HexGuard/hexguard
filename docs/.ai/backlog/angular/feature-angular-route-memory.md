---
id: feature-angular-route-memory
type: feature
status: proposed
created: 2026-06-13
package: '@hexguard/angular-route-memory'
---

# Angular Route Memory Package

## Summary

Design `@hexguard/angular-route-memory` as a package for standardizing repeated route memory
patterns such as return-to-list flows, preserved filters, last active tab, and route-scoped scroll
or page context restoration.

The repeated problem is that feature flows often lose user context when navigating between list,
detail, edit, and modal routes, and teams rebuild their own back-link and restoration behavior.

## Goals

- Standardize route-to-route memory and restore flows.
- Support return links, remembered tabs, remembered filters, and optional scroll restoration.
- Keep the package route-scoped and explicit.
- Compose with url-state and page-context packages.

## Non-Goals

- Replacing Angular router.
- Global browser-history replacement.
- Owning all navigation policies.

## Decisions

- Prefer explicit remembered context contracts over implicit magic.
- Keep route restoration state serializable and testable.
- Compose with URL state rather than duplicating it.

## Implementation Plan

1. Define the route-memory contract and restore triggers.
2. Support explicit save and restore of route-scoped context.
3. Add helpers for list-detail-return and tab restore patterns.
4. Define cleanup and expiration behavior.
5. Add focused tests and demos for list-detail-edit flows.

## Validation

- Unit tests for restore behavior and cleanup semantics.
- Demo coverage for list-detail-edit navigation loops.

## Follow-Ups

- Revisit scroll restoration only if it stays deterministic and framework-friendly.
- Compare overlap with page-context once both proposals mature.

---

---

## Expanded Implementation Plan

### Proposed Public API

```ts
import { injectRouteMemory } from '@hexguard/angular-route-memory';

const memory = injectRouteMemory();

// Save route-scoped context
memory.save('orders-list', {
  tab: 'active',
  scrollY: 450,
});

// Restore on return
const ctx = memory.restore('orders-list');
// → { tab: 'active', scrollY: 450 } | null

// Clear
memory.clear('orders-list');
memory.clearAll();

// Auto-save on route leave
memory.autoSave('orders-list', () => ({
  tab: currentTab(),
  scrollY: window.scrollY,
}));

// Signals
memory.hasMemory('orders-list');   // Signal<boolean>
```

### Phase 0: Foundation

1. Scaffold `angular/packages/angular-route-memory/`.
2. Add build/test scripts.

### Phase 1: Core Implementation

3. Implement `injectRouteMemory()` with in-memory `Map<string, unknown>` store.
4. Implement `save(key, context)`, `restore(key)`, `clear(key)`, `clearAll()`.
5. Implement `autoSave(key, factory)` — uses Angular `OnDestroy` or router `NavigationEnd` to save.
6. Implement `hasMemory(key)` signal.
7. Implement optional `serialized` mode that JSON-serializes to sessionStorage for cross-tab survival.
8. Add unit tests for: save/restore cycle, missing key, overwrite, clear, auto-save trigger, serialization round-trip, expiration.

### Phase 2: Demo & Docs

9. Add demo route showing list → detail → back with restored tab/scroll position.
10. Add Playwright coverage.
11. Write docs, update README.

### Phase 3: Release

12. Add verify script, release workflow.
13. Run validation gate.

## Validation

- `pnpm test:lib:route-memory`.
- `pnpm test:e2e`.
- `pnpm build:lib`.
