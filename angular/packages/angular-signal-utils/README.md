# @hexguard/angular-signal-utils

**Signal utility helpers for Angular.** `computedFrom`, `injectToggle`, `memoized`, and `throttledSignal` — pure function primitives for common signal patterns.

---

## Installation

```bash
pnpm add @hexguard/angular-signal-utils
```

## API

### `computedFrom(deps, project, options?)`

Derive a signal from multiple source signals.

```typescript
const firstName = signal('Jane');
const lastName = signal('Doe');
const fullName = computedFrom([firstName, lastName], (first, last) =>
  `${first} ${last}`
);
```

### `injectToggle(initial?)`

Boolean toggle signal with convenience methods.

```typescript
const expanded = injectToggle(true);
expanded.value(); // true
expanded.toggle(); // false
expanded.on();  // true
expanded.off(); // false
```

### `memoized(factory, options?)`

Cached computed with optional TTL expiry.

```typescript
const expensive = memoized(() => computeHeavyValue(), { ttlMs: 5000 });
expensive(); // calls factory
expensive(); // returns cached (within TTL)
// after 5s:
expensive(); // calls factory again
```

### `throttledSignal(initialValue, delayMs, options?)`

Rate-limited signal emissions with leading/trailing support.

```typescript
const throttled = throttledSignal(source, 200);
throttled.value();     // throttled output
throttled.isPending(); // trailing write pending?
throttled.set('new');  // write to source
throttled.flush();     // emit immediately
throttled.cancel();    // cancel pending
```

## Scope Boundaries

| Concern | Status |
|---------|--------|
| `computedFrom` multi-dep derived signal | ✅ |
| `injectToggle` boolean toggle | ✅ |
| `memoized` with/without TTL | ✅ |
| `throttledSignal` leading/trailing/flush/cancel | ✅ |
| `debouncedSignal` | ❌ (use `@hexguard/angular-debounce`) |
| `lazySignal` | ❌ (v0.2) |

## Demo

Visit `/packages/angular-signal-utils/demo` to test computedFrom, toggle, memoized, and throttledSignal.
