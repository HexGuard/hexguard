# @hexguard/angular-skeleton — Deep Package Notes

Headless skeleton loading state: standardized placeholder state with configurable shapes, shimmer animation signals, and async-state integration — no CSS opinions, just signals.

## Problem

Skeleton screens are one of the most common perceived-performance patterns in Angular apps — show a grey placeholder that mimics the content layout while data loads — yet every team rebuilds the same CSS animation, shape variants, timing, and visibility logic from scratch.

**`@hexguard/angular-skeleton`** provides headless skeleton state signals that compose with any loading state, eliminating the need to rebuild show/hide logic, variant tracking, and shimmer timing.

## API

### `skeletonState(options?)`

Creates headless skeleton state with configurable options:

| Option              | Type              | Default  | Description                     |
| ------------------- | ----------------- | -------- | ------------------------------- |
| `variant`           | `SkeletonVariant` | `'text'` | Shape variant                   |
| `count`             | `number`          | `1`      | Number of skeleton items        |
| `shimmer`           | `boolean`         | `true`   | Enable shimmer animation signal |
| `shimmerDurationMs` | `number`          | `1500`   | Shimmer animation duration      |

Returns `SkeletonState`:

| Member              | Type                                            | Description                  |
| ------------------- | ----------------------------------------------- | ---------------------------- |
| `isActive`          | `Signal<boolean>`                               | Visibility                   |
| `variant`           | `Signal<SkeletonVariant>`                       | Current shape                |
| `count`             | `Signal<number>`                                | Item count                   |
| `shimmer`           | `Signal<{active: boolean, durationMs: number}>` | Shimmer state                |
| `show()` / `hide()` | `() => void`                                    | Toggle visibility            |
| `setVariant(v)`     | `(SkeletonVariant) => void`                     | Change shape                 |
| `setCount(n)`       | `(number) => void`                              | Change count (clamped to ≥0) |

### `bindLoading(skeleton, loading)`

Bridges any `Signal<boolean>` to skeleton visibility via `effect()`. When `loading()` is true, the skeleton shows; when false, it hides.

### `SkeletonVariant`

Eight shape variants: `'text' | 'text-short' | 'circle' | 'avatar' | 'card' | 'table-row' | 'table-header' | 'custom'`

## Design Decisions

1. **Effect-based bridge.** `bindLoading()` uses Angular's `effect()` for eager reactivity — no lazy computed signal edge cases.
2. **Rendering-agnostic.** No DOM elements, no CSS, no animation styles — consumers map variants to their own rendering.
3. **Count clamping.** `setCount(-3)` results in `count() === 0` — prevents negative iteration ranges.
4. **Shimmer is a signal, not a timer.** The `shimmer` signal exposes `{ active, durationMs }` — consumers apply CSS animation when active.
5. **Zero runtime deps beyond Angular core and tslib.** No dependency on `@hexguard/angular-async-state` — the bridge accepts any `Signal<boolean>`.

## Code Examples

### Card skeleton with shimmer

```typescript
const skeleton = skeletonState({ variant: 'card', count: 3, shimmer: true });
skeleton.show();
```

```html
@if (skeleton.isActive()) { @for (i of [].constructor(skeleton.count()); track i) {
<div class="skeleton-card" [class.skeleton--shimmer]="skeleton.shimmer().active">
  <!-- Consumer renders the card placeholder -->
</div>
} }
```

### Bridge to async-state loading

```typescript
const data = injectAsyncValue(() => api.getUsers());
const skeleton = skeletonState({ variant: 'table-row', count: 5 });
bindLoading(skeleton, data.isLoading);
// skeleton.isActive() automatically tracks data.isLoading()
```

## Related Resources

- [Package README](../../angular/packages/angular-skeleton/README.md)
- [Package Catalog](../README.md)
- [Source Code](../../angular/packages/angular-skeleton/src/)
