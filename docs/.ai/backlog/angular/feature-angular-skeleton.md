---
id: feature-angular-skeleton
type: feature
status: proposed
created: 2026-06-17
package: '@hexguard/angular-skeleton'
---

# Angular Skeleton Package

## Summary

Design `@hexguard/angular-skeleton` as a headless Angular package for standardizing skeleton and placeholder loading state with configurable shapes, shimmer animation state, and headless composition with async-state value and action lifecycle signals.

The repeated problem is that skeleton screens are one of the most common perceived-performance patterns in Angular apps — show a grey placeholder that mimics the content layout while data loads — yet every team rebuilds the same CSS animation, shape variants (text, avatar, card, table-row), timing, and visibility logic from scratch. A standardized headless contract would let apps plug skeleton state into any async-state outlet without reinventing the animation or timing logic.

## Goals

- Provide headless skeleton state signals (`isActive`, `variant`, `count`) that compose with async-state loading states.
- Provide built-in shape variants: `text`, `circle`, `avatar`, `card`, `table-row`, `table-header`, and `custom`.
- Keep the package rendering-agnostic — no DOM elements, no CSS, no animation styles.
- Provide a configurable shimmer animation signal (on/off, duration, direction) that consumers can map to CSS or canvas.
- Provide `skeletonAdapter()` that transforms async-state signals into skeleton-ready inputs.
- Keep the package dependency-free beyond `@angular/core` and `tslib`.

## Non-Goals

- Shipping CSS animations, keyframes, or component styles.
- Replacing the visual rendering of skeletons — that's an app or design-system concern.
- Full-page skeleton layouts — those compose from individual skeleton blocks.
- Generating skeleton dimensions from content measurement or template reflection.

## Decisions

- Treat skeleton state as orthogonal to async-state — the consumer decides when to show skeletons based on loading state.
- Expose skeleton shape variants as string literals, not components — consumers map them to their own rendering.
- Keep the shimmer animation signal as a boolean + duration — the consumer applies CSS animation when active.
- Provide `skeletonAdapter()` as a convenience bridge from async-state's `isLoading()` to skeleton `isActive`.
- Keep the core primitive small: one factory function returning signals.

## Proposed Public API

```ts
import { skeletonState, type SkeletonVariant, type SkeletonOptions } from '@hexguard/angular-skeleton';

// Standalone skeleton state
const skeleton = skeletonState({
  variant: 'card',                      // default variant
  count: 3,                             // number of skeleton items
  shimmer: true,
  shimmerDurationMs: 1500,
});

// Reactive signals
const isActive = skeleton.isActive;     // Signal<boolean> — manually set
const variant = skeleton.variant;       // Signal<SkeletonVariant>
const count = skeleton.count;           // Signal<number>
const shimmer = skeleton.shimmer;       // Signal<{ active: boolean; durationMs: number }>

// Toggle
skeleton.show();
skeleton.hide();

// Bridge from async-state
import { injectAsyncValue } from '@hexguard/angular-async-state';
import { skeletonAdapter } from '@hexguard/angular-skeleton';

const data = injectAsyncValue(...);
const skeleton = skeletonAdapter(data, { variant: 'table-row', count: 5 });

// Now skeleton.isActive() === data.isLoading()

// Type for variants
type SkeletonVariant =
  | 'text'
  | 'text-short'
  | 'circle'
  | 'avatar'
  | 'card'
  | 'table-row'
  | 'table-header'
  | 'custom';

// Options
interface SkeletonOptions {
  variant?: SkeletonVariant;
  count?: number;
  shimmer?: boolean;
  shimmerDurationMs?: number;
}

// Return type
interface SkeletonState {
  readonly isActive: Signal<boolean>;
  readonly variant: Signal<SkeletonVariant>;
  readonly count: Signal<number>;
  readonly shimmer: Signal<{ active: boolean; durationMs: number }>;
  show(): void;
  hide(): void;
}
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold the publishable Angular library under `angular/packages/angular-skeleton/` following existing conventions.
2. Add build and test scripts to `angular/package.json` (`build:lib:skeleton`, `test:lib:skeleton`).

### Phase 1: Core Implementation

3. Implement `skeletonState()` factory with `isActive`, `variant`, `count`, `shimmer` signals.
4. Implement `show()` and `hide()` control methods.
5. Implement shimmer signal that pulses a boolean at the configured interval.
6. Implement `skeletonAdapter()` that binds `isActive` to an async-state's `isLoading()` signal.
7. Add unit tests for: manual show/hide toggling, shimmer timing, adapter binding to async-state, variant/count changes, cleanup on destroy.

### Phase 2: Demo & Docs

8. Add a demo route at `/packages/angular-skeleton` showing:
   - Card skeleton, table-row skeleton, avatar+text skeleton variants
   - Shimmer animation toggle
   - Integration with async-state value loading
   - Custom skeleton variant passthrough
9. Add Playwright coverage for the demo page.
10. Write the deep-dive doc at `docs/packages/angular-skeleton.md`.
11. Update the npm-facing `README.md`.

### Phase 3: Release

12. Add `verify:package:skeleton` to `angular/package.json`.
13. Add `.github/workflows/release-angular-skeleton.yml`.
14. Run `pnpm test:ci` and `pnpm build` for the full validation gate.

## Validation

- `pnpm test:lib:skeleton` — unit tests for state, adapter, shimmer.
- `pnpm build:lib` — package builds.
- `pnpm test:app` — demo compiles.
- `pnpm test:e2e` — Playwright for demo interactions.
- `pnpm verify:package:skeleton` — tarball smoke test.

## Follow-Ups

- Revisit whether a companion `@hexguard/angular-skeleton-css` package with ready-made animation styles is worth publishing separately.
- Evaluate CSS-based skeleton dimension hints (e.g., `aspect-ratio` presets) if consumer demand for rendering helpers grows.
