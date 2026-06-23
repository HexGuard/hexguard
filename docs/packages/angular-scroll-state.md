# @hexguard/angular-scroll-state — Deep Package Notes

Scroll position save/restore, infinite-scroll detection, scroll-spy section tracking, and imperative smooth-scroll helpers with signal-based primitives.

## Problem

Business apps with lists, detail pages, or long content need scroll management: save/restore scroll position when navigating back, infinite-scroll triggers for load-more patterns, "back to top" on route change, and active-section highlighting for table-of-contents navigation. Every team rebuilds the same scroll event wiring, IntersectionObserver setup, and RAF throttling.

**`@hexguard/angular-scroll-state`** standardizes these four patterns into reusable primitives.

## API

- `injectScrollState(options?)` — Scroll position tracking with rAF-throttled events, save/restore, and configurable scroll container
- `inInfiniteScroll(sentinel, options?)` — IntersectionObserver-based infinite-scroll with `isTriggered`, `isLoading`, `isExhausted` signals
- `inScrollSpy(sectionIds, options?)` — Track the most-visible section via IntersectionObserver
- `scrollTo(options)` — Imperative smooth-scroll to a position or element

---

## Assessment: Potential Improvements

| Area  | Suggestion                                                                                                                                                                         | Priority    |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| API   | Consider adding `scrollToBottom()` helper for chat/message-list-style auto-scroll                                                                                                  | Low         |
| API   | Consider adding `scrollIntoViewIfNeeded()` for conditional smooth-scroll only when element is not already visible                                                                  | Low         |
| API   | Consider adding `pullToRefresh()` as a companion export sharing the same observer pattern                                                                                          | Low         |
| API   | Consider adding a `ScrollRestoreDirective` that auto-restores scroll on route activation                                                                                           | Low         |
| Tests | Consider adding integration tests with a real scroll container using Cypress/Playwright-style interaction                                                                          | Medium      |
| API   | ✅ Added RxJS observable alternatives — `fromScrollPosition()`, `fromInfiniteScroll()`, `fromScrollSpy()` — all return `Observable`. Import from `@hexguard/angular-scroll-state`. | Implemented |

## Code Examples

### Save and restore scroll position for list-detail flow

```typescript
import { injectScrollState, scrollTo } from '@hexguard/angular-scroll-state';

@Component({ ... })
class OrdersListComponent {
  private readonly scrollState = injectScrollState();

  onNavigateToDetail(): void {
    this.scrollState.save('orders-list');
  }

  constructor() {
    const savedY = this.scrollState.restore('orders-list');
    if (savedY !== null) {
      scrollTo({ y: savedY });
    }
  }
}
// When the user returns from a detail page, the list
// scroll position is restored automatically.
```

### Infinite scroll with sentinel element

```typescript
import { Component, ElementRef, effect, viewChild } from '@angular/core';
import { inInfiniteScroll } from '@hexguard/angular-scroll-state';

@Component({
  template: `
    <div #sentinel>Load more</div>
    @if (infinite.isLoading()) {
      <div>Loading...</div>
    }
    @if (infinite.isExhausted()) {
      <div>No more items</div>
    }
  `,
})
class ItemListComponent {
  readonly sentinel = viewChild.required<ElementRef>('sentinel');
  readonly infinite = inInfiniteScroll(this.sentinel, { rootMargin: '200px' });

  constructor() {
    effect(() => {
      if (this.infinite.isTriggered()) {
        this.loadMore();
      }
    });
  }
}
// When the sentinel enters the viewport, isTriggered becomes true.
// The consumer sets isLoading/isExhausted externally.
```

### Scroll-spy for table of contents

```typescript
import { inScrollSpy } from '@hexguard/angular-scroll-state';

@Component({ ... })
class DocPageComponent {
  readonly spy = inScrollSpy(['intro', 'details', 'api', 'pricing']);
  // spy.activeSection() → Signal<string | null>
  // Highlights the current section in the table of contents sidebar.
}
```

### RxJS observable alternatives

Three standalone observable functions for RxJS consumers:

```ts
import {
  fromScrollPosition,
  fromInfiniteScroll,
  fromScrollSpy$,
} from '@hexguard/angular-scroll-state';
import { debounceTime, filter, switchMap } from 'rxjs/operators';

// 1. Scroll position with RxJS operators
fromScrollPosition()
  .pipe(debounceTime(150))
  .subscribe((y) => updateProgressBar(y));

// 2. Infinite scroll with switchMap (auto-cancels previous load)
const sentinel = document.getElementById('scroll-sentinel')!;
fromInfiniteScroll(sentinel)
  .pipe(switchMap(() => fetch('/api/items?page=' + page++)))
  .subscribe((items) => appendItems(items));

// 3. Scroll-spy for active section tracking
fromScrollSpy$(['intro', 'features', 'api', 'pricing']).subscribe((sectionId) => {
  highlightNav(sectionId);
});
```

## Related Resources

- [Package README](../../angular/packages/angular-scroll-state/README.md)
- [Package Catalog](../README.md)
- [Demo Routes](../../angular/apps/demo-angular/src/app/features/packages/angular/angular-scroll-state/)
- [Source Code](../../angular/packages/angular-scroll-state/src/)

---

## API Review Findings

Review date: 2026-06-23. Findings are observational.

### Observations

| Dimension              | Finding                                                                                                                                                               | Severity |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Public API Design      | 4 exports: `injectScrollState`, `inInfiniteScroll`, `inScrollSpy`, `scrollTo`. Each focused on one concern. Clean separation.                                         | praise   |
| Implementation Quality | rAF-throttled scroll listeners. IntersectionObserver-based infinite-scroll and scroll-spy. Graceful fallback when IntersectionObserver is unavailable.                | praise   |
| Implementation Quality | Configurable debounce, root margin, scroll container. Defaults to window for broad compatibility.                                                                     | praise   |
| Test Coverage          | 13 tests across 4 test files: scroll position, save/restore, infinite-scroll defaults, scroll-spy with mock IntersectionObserver, scrollTo with window.scrollTo mock. | praise   |
| Demo Integration       | Interactive demo with scroll tracking, save/restore, scroll-to-top, and scrollable long content area.                                                                 | praise   |
