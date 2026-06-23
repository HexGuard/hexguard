# @hexguard/angular-route-memory — Deep Package Notes

Route-to-route memory for Angular: save and restore list filters, active tabs, and scroll positions across navigations.

## Problem

Every list-detail flow has the same UX gap: a user navigates from a list to a detail page, then back — and the list has reset to page 1, the active tab is gone, the scroll position is lost. Teams rebuild the same `Map<string, unknown>` save/restore logic, often with subtle bugs in cleanup, overwrite, and serialization.

**`@hexguard/angular-route-memory`** standardizes this into one injectable contract with signal-based feedback.

## API

- `save(key, context)` — Save route-scoped context under the given key
- `restore(key)` → `Record<string, unknown> | null` — Restore previously saved context
- `clear(key)` / `clearAll()` — Remove saved context
- `autoSave(key, factory)` — Auto-save the context returned by `factory` when the injection scope is destroyed
- `hasMemory(key): Signal<boolean>` — Reactive signal indicating whether a value exists for the given key
- `serialized` option — When `true`, context is JSON-roundtripped through `sessionStorage` to survive hard navigations

---

## Assessment: Potential Improvements

| Area  | Suggestion                                                                                            | Priority |
| ----- | ----------------------------------------------------------------------------------------------------- | -------- |
| API   | Consider adding a `TTL` option so saved memory auto-expires after a configurable duration             | Low      |
| API   | Consider a `saveAndNavigate()` helper that saves context then navigates to a route                    | Low      |
| API   | Consider adding `restoreAndClear(key)` — a single call that restores and removes the entry atomically | Low      |
| Tests | Missing test: `hasMemory` signal reactivity after `save()` in serialized mode                         | Low      |
| Tests | Missing test: multiple `autoSave` calls on different keys                                             | Low      |

## Code Examples

### Save and restore list filters on return

```typescript
import { injectRouteMemory } from '@hexguard/angular-route-memory';

@Component({ ... })
class OrdersListComponent {
  private readonly memory = injectRouteMemory();

  readonly currentTab = signal('active');
  readonly searchQuery = signal('');

  onNavigateToDetail(id: string): void {
    this.memory.save('orders-list', {
      tab: this.currentTab(),
      search: this.searchQuery(),
    });
  }

  constructor() {
    const saved = this.memory.restore('orders-list');
    if (saved) {
      this.currentTab.set(saved['tab'] as string);
      this.searchQuery.set(saved['search'] as string);
    }
  }
}
// The list restores the previously active tab and search term
// when the user navigates back from a detail page.
```

### Auto-save on scope destruction

```typescript
@Component({ ... })
class FilterPanelComponent {
  private readonly memory = injectRouteMemory();

  constructor() {
    this.memory.autoSave('filter-panel', () => ({
      expandedSections: this.expandedSections(),
      sortOrder: this.sortOrder(),
    }));
  }
}
// The filter state is automatically saved when the component is destroyed
// and can be restored on next visit.
```

## Related Resources

- [Package README](../../angular/packages/angular-route-memory/README.md)
- [Package Catalog](../README.md)
- [Demo Routes](../../angular/apps/demo-angular/src/app/features/packages/angular/angular-route-memory/)
- [Source Code](../../angular/packages/angular-route-memory/src/)

---

## API Review Findings

Review date: 2026-06-23. Findings are observational.

### Observations

| Dimension              | Finding                                                                                                                                                       | Severity |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Public API Design      | Minimal surface: 1 function (`injectRouteMemory`), 2 types. Clear save/restore/clear/autoSave contract with signal-based `hasMemory`.                         | praise   |
| Implementation Quality | In-memory store with optional sessionStorage serialization. Auto-save via DestroyRef. Clean API with spread-copy on restore to prevent reference leaks.       | praise   |
| Test Coverage          | 13 tests covering save/restore, overwrite, clear, clearAll, hasMemory, autoSave, serialized mode persistence, sessionStorage hydration, and clearAll scoping. | praise   |
| Demo Integration       | Interactive demo with save/restore/clear buttons and hasMemory signal feedback.                                                                               | praise   |
