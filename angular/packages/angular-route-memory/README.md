# @hexguard/angular-route-memory

**Route-to-route memory for Angular.** Save and restore list filters, active tabs, and scroll positions across navigations — no global state or RxJS required.

**[Deep package notes](docs/packages/angular-route-memory.md)** · **[Demo](/packages/angular-route-memory/demo)**

---

## Problem

Every list-detail flow has the same UX gap: a user navigates from a list to a detail page, then back — and the list has reset to page 1, the active tab is gone, the scroll position is lost. Teams rebuild the same `Map<string, unknown>` save/restore logic.

**`@hexguard/angular-route-memory`** standardizes this into one injectable contract with `save(key, context)`, `restore(key)`, `autoSave()`, and signal-based `hasMemory()` feedback.

## Installation

```bash
pnpm add @hexguard/angular-route-memory
```

## Quickstart

```typescript
import { injectRouteMemory } from '@hexguard/angular-route-memory';

const memory = injectRouteMemory();

// Save before navigating away
memory.save('orders-list', { tab: 'active', scrollY: window.scrollY });

// Restore on return
const saved = memory.restore('orders-list');
if (saved) {
  activeTab.set(saved['tab'] as string);
  scrollTo({ y: saved['scrollY'] as number });
}
```

## Use Cases

### Save/restore list state

```typescript
@Component({ ... })
class OrdersListComponent {
  private readonly memory = injectRouteMemory();

  onNavigateToDetail(id: string) {
    this.memory.save('orders-list', { tab: this.currentTab() });
  }

  constructor() {
    const saved = this.memory.restore('orders-list');
    if (saved) this.currentTab.set(saved['tab'] as string);
  }
}
```

### Auto-save on component destroy

```typescript
this.memory.autoSave('filter-panel', () => ({
  expandedSections: this.expandedSections(),
  sortOrder: this.sortOrder(),
}));
```

### Optional sessionStorage persistence

```typescript
const memory = injectRouteMemory({ serialized: true });
// Context survives hard navigations and browser refreshes.
```

## API

### `injectRouteMemory(options?)`

| Member               | Type                             | Description                                |
| -------------------- | -------------------------------- | ------------------------------------------ |
| `save(key, context)` | `(string, Record) => void`       | Save route-scoped context                  |
| `restore(key)`       | `(string) => Record \| null`     | Restore saved context (returns a copy)     |
| `clear(key)`         | `(string) => void`               | Clear a specific key                       |
| `clearAll()`         | `() => void`                     | Clear all saved memory                     |
| `autoSave(key, fn)`  | `(string, () => Record) => void` | Auto-save on scope cleanup via DestroyRef  |
| `hasMemory(key)`     | `(string) => Signal<boolean>`    | Reactive indicator of whether a key exists |

| Option       | Type      | Default | Description                                |
| ------------ | --------- | ------- | ------------------------------------------ |
| `serialized` | `boolean` | `false` | When true, persists through sessionStorage |

## Scope Boundaries

| Concern                                     | Status        |
| ------------------------------------------- | ------------- |
| In-memory save/restore with signal feedback | ✅            |
| Auto-save on scope destroy                  | ✅            |
| SessionStorage serialization mode           | ✅            |
| Cross-tab synchronization                   | ❌ (deferred) |
| TTL-based auto-expiry                       | ❌ (deferred) |

## Demo

Visit `/packages/angular-route-memory/demo` for save/restore/clear operations with signal feedback.
