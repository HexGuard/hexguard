# @hexguard/angular-signal-utils — Deep Package Notes

Signal utility helpers: `computedFrom`, `injectToggle`, `memoized`, and `throttledSignal`.

## API

- `computedFrom(deps, project, options?)` → `Signal<T>` — Multi-dep derived signal using `computed()` internally.
- `injectToggle(initial?)` → `ToggleHandle` — Boolean toggle with `.value`, `.toggle()`, `.set()`, `.on()`, `.off()`.
- `memoized(factory, options?)` → `Signal<T>` — Cached computed. With TTL, a timer marks the value stale and recomputes on next read.
- `throttledSignal(initialValue, delayMs, options?)` → `ThrottledValue<T>` — Rate-limited signal with `.value`, `.isPending`, `.set()`, `.flush()`, `.cancel()`.

---

## Assessment

| Area | Suggestion | Priority |
|------|-----------|----------|
| API | Consider adding `lazySignal` in v0.2 | Low |
| Tests | Missing: `computedFrom` with custom equality | Low |
| Tests | Missing: `throttledSignal` with `{ leading: false }` | Low |

## Code Examples

### computedFrom

```typescript
const first = signal('Jane');
const last = signal('Doe');
const full = computedFrom([first, last], (f, l) => `${f} ${l}`);
```

### injectToggle

```typescript
const expanded = injectToggle(true);
expanded.toggle();
```

### memoized with TTL

```typescript
const data = memoized(() => fetchExpensiveData(), { ttlMs: 10_000 });
```
