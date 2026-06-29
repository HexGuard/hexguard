# @hexguard/angular-recently-viewed

**Recently-viewed item tracking for Angular.** Configurable max, dedup, TTL expiry, and storage-backed persistence via `@hexguard/angular-storage`.

---

## Installation

```bash
pnpm add @hexguard/angular-recently-viewed
```

Requires `@hexguard/angular-storage` as a peer dependency.

## Quickstart

```typescript
import { injectRecentlyViewed } from '@hexguard/angular-recently-viewed';

const recent = injectRecentlyViewed({ maxItems: 10 });

recent.add({ id: 'order-42', label: 'Order #42', route: '/orders/42', viewedAt: Date.now() });
recent.items(); // Signal — most recent first
recent.remove('order-42');
recent.clear();
```

## API

### `injectRecentlyViewed(options?)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxItems` | `number` | `20` | Maximum items to keep |
| `storageKey` | `string` | `hexguard-recently-viewed` | Storage key |
| `ttlMs` | `number?` | — | Auto-expire items older than this |
| `dedup` | `'replace' \| 'ignore' \| 'allow-duplicates'` | `'replace'` | Dedup strategy on re-view |

| Member | Type | Description |
|--------|------|-------------|
| `items` | `Signal<readonly RecentlyViewedItem[]>` | Most recent first |
| `count` | `Signal<number>` | Number of items |
| `add(item)` | — | Add or update an item |
| `remove(id)` | — | Remove by ID |
| `clear()` | — | Clear all |

## Scope Boundaries

| Concern | Status |
|---------|--------|
| Storage-backed persistence | ✅ |
| Dedup strategies | ✅ |
| maxItems trim | ✅ |
| TTL expiry | ✅ |
| Cross-tab sync (via angular-storage) | ✅ |
| Automatic Router event tracking | ❌ (v0.2) |

## Demo

Visit `/packages/angular-recently-viewed/demo` to test recently-viewed tracking.
