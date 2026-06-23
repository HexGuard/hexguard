# @hexguard/angular-scroll-state

**Scroll position management for Angular.** Save/restore scroll positions, infinite-scroll detection, scroll-spy section tracking, and imperative smooth-scroll helpers — all with signal-based primitives.

**[Deep package notes](docs/packages/angular-scroll-state.md)** · **[Demo](/packages/angular-scroll-state/demo)**

---

## Problem

Business apps with lists, detail pages, or long content need scroll management: save/restore position when navigating back, infinite-scroll triggers for load-more, scroll-spy for table-of-contents navigation. Every team rebuilds the same IntersectionObserver setup, scroll event wiring, and RAF throttling.

**`@hexguard/angular-scroll-state`** standardizes these four patterns into reusable primitives.

## Installation

```bash
pnpm add @hexguard/angular-scroll-state
```

## Quickstart

```typescript
import { injectScrollState, scrollTo } from '@hexguard/angular-scroll-state';

const scrollState = injectScrollState();

// Save before navigating away
scrollState.save('list-scroll');

// Restore on return
const y = scrollState.restore('list-scroll');
if (y !== null) scrollTo({ y });
```

## Use Cases

### Infinite scroll with sentinel

```typescript
import { inInfiniteScroll } from '@hexguard/angular-scroll-state';

@Component({
  template: `<div #sentinel></div>`,
})
class ItemListComponent {
  readonly sentinel = viewChild.required<ElementRef>('sentinel');
  readonly infinite = inInfiniteScroll(this.sentinel, { rootMargin: '200px' });

  constructor() {
    effect(() => {
      if (this.infinite.isTriggered()) this.loadMore();
    });
  }
}
```

### Scroll-spy for table of contents

```typescript
import { inScrollSpy } from '@hexguard/angular-scroll-state';

const spy = inScrollSpy(['intro', 'details', 'api']);
// spy.activeSection() → Signal<string | null>
```

## API

### `injectScrollState(options?)`

| Member         | Type                         | Description                      |
| -------------- | ---------------------------- | -------------------------------- |
| `scrollY`      | `Signal<number>`             | Current vertical scroll position |
| `save(key)`    | `(string) => void`           | Save current scroll position     |
| `restore(key)` | `(string) => number \| null` | Restore saved scroll position    |

| Option            | Type         | Default  | Description          |
| ----------------- | ------------ | -------- | -------------------- |
| `scrollContainer` | `ElementRef` | `window` | Scroll container     |
| `debounceMs`      | `number`     | `100`    | Scroll save debounce |

### `inInfiniteScroll(sentinel, options?)`

| Signal        | Type              | Description                        |
| ------------- | ----------------- | ---------------------------------- |
| `isTriggered` | `Signal<boolean>` | Sentinel entered viewport          |
| `isLoading`   | `Signal<boolean>` | Set by consumer when loading       |
| `isExhausted` | `Signal<boolean>` | Set by consumer when no more items |

### `inScrollSpy(sectionIds, options?)`

| Signal          | Type                     | Description             |
| --------------- | ------------------------ | ----------------------- |
| `activeSection` | `Signal<string \| null>` | Most-visible section ID |

### `scrollTo(options)`

| Option      | Type                 | Default    | Description            |
| ----------- | -------------------- | ---------- | ---------------------- |
| `y?`        | `number`             | `0`        | Target scroll position |
| `element?`  | `ElementRef`         | —          | Target element         |
| `behavior?` | `'auto' \| 'smooth'` | `'smooth'` | Scroll behavior        |

## Scope Boundaries

| Concern                                          | Status                        |
| ------------------------------------------------ | ----------------------------- |
| Scroll position tracking with rAF throttling     | ✅                            |
| Scroll save/restore                              | ✅                            |
| Infinite-scroll detection (IntersectionObserver) | ✅                            |
| Scroll-spy section tracking                      | ✅                            |
| Imperative scroll-to helper                      | ✅                            |
| Virtual scrolling / recycle-pool rendering       | ❌ (`@angular/cdk/scrolling`) |
| Pull-to-refresh                                  | ❌ (deferred)                 |

## Demo

Visit `/packages/angular-scroll-state/demo` for scroll tracking, save/restore, and scroll-to-top.
