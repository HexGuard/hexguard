---
id: feature-angular-scroll-state
type: feature
status: proposed
created: 2026-06-17
package: '@hexguard/angular-scroll-state'
---

# Angular Scroll State Package

## Summary

Design `@hexguard/angular-scroll-state` as a headless Angular package for standardizing scroll position save and restore, infinite-scroll threshold detection, scroll-to-top on navigation, and scroll-spy active-section tracking.

The repeated problem is that most business apps with lists, detail pages, or long content need scroll management, yet every team rebuilds the same scroll-position save/restore for list-detail flows, infinite-scroll triggers with loading indicators, "back to top" behavior on route changes, and active-section highlighting for table-of-contents navigation. These patterns are well-understood but never standardized into a reusable Angular contract.

## Goals

- Provide `injectScrollState()` for scroll-position save/restore with configurable scroll container and debounce.
- Provide `inInfiniteScroll()` for threshold-based infinite-scroll / load-more detection with loading and exhausted states.
- Provide `scrollTo(options)` imperative helper for smooth scroll-to-element, scroll-to-top, and scroll-to-position.
- Provide `inScrollSpy()` for tracking which section is currently in view (table-of-contents, anchor nav).
- Compose with route-memory (proposed) for list-detail scroll restoration across navigations.
- Keep all primitives headless — no UI, no scrollbar styling, no scrollbar customization.

## Non-Goals

- Virtual scrolling or recycle-pool rendering (that's `@angular/cdk/scrolling`).
- Scrollbar customization or native scrollbar replacement.
- Scroll-driven animations — that's a rendering/animation concern.
- Pull-to-refresh — consider a separate companion if demand arises.

## Decisions

- Default to `window` as the scroll container, with an optional `ElementRef` parameter for scrollable containers.
- Use `requestAnimationFrame`-throttled scroll event listeners rather than raw scroll events.
- Keep scroll-position storage in memory by default, with an optional serializable adapter for session persistence.
- Treat infinite-scroll as a headless signal — the consumer renders the loading indicator and trigger element.
- Provide scroll-spy as a separate export — it has different options (root margin, threshold array) from infinite-scroll.

## Proposed Public API

```ts
import { injectScrollState, inInfiniteScroll, scrollTo, inScrollSpy } from '@hexguard/angular-scroll-state';

// Scroll position save/restore
@Component({ ... })
export class MyListComponent {
  private readonly scrollState = injectScrollState({
    scrollContainer?: ElementRef,        // defaults to window
    saveKey?: string,                    // for session restore across navigations
    debounceMs?: number,                 // scroll save debounce (default 100)
  });

  readonly scrollY = this.scrollState.scrollY;  // Signal<number>

  constructor() {
    // Save current scroll position
    this.scrollState.save('list-scroll');

    // Restore on init
    const saved = this.scrollState.restore('list-scroll');
    if (saved) scrollTo({ y: saved });
  }
}

// Infinite scroll
@Component({
  template: `
    <div #sentinel>Load more</div>
    @if (infinite.isLoading()) { <div>Loading...</div> }
    @if (infinite.isExhausted()) { <div>No more items</div> }
  `,
})
export class MyListComponent {
  readonly sentinel = viewChild.required<ElementRef>('sentinel');

  readonly infinite = inInfiniteScroll(this.sentinel, {
    rootMargin: '200px',                 // trigger 200px before sentinel is visible
    threshold: 0,
  });

  constructor() {
    effect(() => {
      if (this.infinite.isTriggered()) {
        this.loadMore();                 // consumer calls the API
      }
    });
  }
}

// Scroll spy
@Component({
  template: `
    <nav>
      <a [class.active]="spy.activeSection() === 'intro'" href="#intro">Intro</a>
      <a [class.active]="spy.activeSection() === 'details'" href="#details">Details</a>
    </nav>
    <section id="intro">...</section>
    <section id="details">...</section>
  `,
})
export class MyPageComponent {
  readonly spy = inScrollSpy(['intro', 'details', 'pricing'], {
    rootMargin: '-80px 0px -60% 0px',    // account for fixed header
  });

  readonly activeSection = this.spy.activeSection;  // Signal<string | null>
}

// Imperative scroll helper
function scrollTo(options: { y?: number; element?: ElementRef; behavior?: 'auto' | 'smooth' }): void;
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold the publishable Angular library under `angular/packages/angular-scroll-state/` following existing conventions.
2. Add build and test scripts to `angular/package.json` (`build:lib:scroll-state`, `test:lib:scroll-state`).

### Phase 1: Core Implementation

3. Implement `injectScrollState()` with `scrollY` signal, `save(key)`, `restore(key)`, and in-memory storage.
4. Implement scroll event throttling via `requestAnimationFrame` with configurable debounce.
5. Implement `inInfiniteScroll()` using `IntersectionObserver` on a sentinel element.
6. Implement `isTriggered`, `isLoading`, `isExhausted` signals — the consumer sets `isLoading`/`isExhausted` externally.
7. Implement `scrollTo()` with smooth-scroll support and element-target positioning.
8. Implement `inScrollSpy()` using `IntersectionObserver` with multiple section targets and configurable root margin.
9. Implement `activeSection` signal that updates when the most visible section changes.
10. Add unit tests for: scroll position tracking, save/restore, infinite-scroll trigger, exhausted state, scroll-spy section tracking, IntersectionObserver mock behavior, cleanup on destroy, and multiple scroll containers.

### Phase 2: Demo & Docs

11. Add a demo route at `/packages/angular-scroll-state` showing:
    - Scroll-position indicator with save/restore across route navigation
    - Infinite-scroll demo with mock data loading
    - Scroll-to-top button and scroll-to-section navigation
    - Scroll-spy table-of-contents sidebar
12. Add Playwright coverage for the demo page.
13. Write the deep-dive doc at `docs/packages/angular-scroll-state.md`.
14. Update the npm-facing `README.md`.

### Phase 3: Release

15. Add `verify:package:scroll-state` to `angular/package.json`.
16. Add `.github/workflows/release-angular-scroll-state.yml`.
17. Run `pnpm test:ci` and `pnpm build` for the full validation gate.

## Validation

- `pnpm test:lib:scroll-state` — unit tests for scroll tracking, infinite-scroll, scroll-spy, save/restore.
- `pnpm build:lib` — package builds successfully.
- `pnpm test:app` — demo app compiles.
- `pnpm test:e2e` — Playwright coverage for demo interactions.
- `pnpm verify:package:scroll-state` — tarball smoke test.

## Follow-Ups

- Revisit composition with the proposed `angular-route-memory` package for automatic list-detail scroll restoration.
- Evaluate whether a companion `@hexguard/angular-pull-to-refresh` package would share the same sentinel/observer pattern.
- Consider adding `scrollToBottom()` and `scrollIntoViewIfNeeded()` helpers based on real consumer feedback.
