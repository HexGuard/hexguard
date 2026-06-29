# @hexguard/angular-recently-viewed — Deep Package Notes

Recently-viewed item tracking: configurable max, dedup, TTL, storage-backed persistence via `@hexguard/angular-storage`.

## API

- `injectRecentlyViewed(options?)` → `RecentlyViewedHandle`
- `handle.items` — Signal of items (most recent first)
- `handle.count` — Signal count
- `handle.add(item)` — Add/view an item (dedup based on config)
- `handle.remove(id)` — Remove by ID
- `handle.clear()` — Clear all

## Assessment

| Area | Suggestion | Priority |
|------|-----------|----------|
| API | Consider Route event auto-tracking in v0.2 | Low |
| Tests | Missing: storage fallback when localStorage unavailable | Low |

## Code Examples

```typescript
const recent = injectRecentlyViewed({ maxItems: 5, ttlMs: 86_400_000 });

recent.add({ id: '1', label: 'Order #1', route: '/orders/1', viewedAt: Date.now() });
```
