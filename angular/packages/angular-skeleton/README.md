# @hexguard/angular-skeleton

**Headless skeleton loading state for Angular.** Standardized placeholder state with configurable shapes, shimmer animation signals, and async-state integration — no CSS opinions, just signals.

---

## Problem

Skeleton screens are one of the most common perceived-performance patterns in Angular apps — show a grey placeholder that mimics the content layout while data loads — yet every team rebuilds the same CSS animation, shape variants (text, avatar, card, table-row), timing, and visibility logic from scratch.

**`@hexguard/angular-skeleton`** provides headless skeleton state signals that compose with any loading state.

## Installation

```bash
pnpm add @hexguard/angular-skeleton
```

## Quickstart

```typescript
import { skeletonState, bindLoading } from '@hexguard/angular-skeleton';

// Standalone skeleton
const skeleton = skeletonState({ variant: 'card', count: 3, shimmer: true });
skeleton.show();
// skeleton.isActive() → true

// Bridge to any loading signal
const loading = signal(true);
bindLoading(skeleton, loading);
// skeleton.isActive() tracks loading()
```

```html
@if (skeleton.isActive()) { @for (i of [].constructor(skeleton.count()); track i) {
<div class="skeleton" [class.skeleton--shimmer]="skeleton.shimmer().active">
  <!-- Consumer renders the shape -->
</div>
} }
```

## API

### `skeletonState(options?)`

| Option              | Type              | Default  | Description                |
| ------------------- | ----------------- | -------- | -------------------------- |
| `variant`           | `SkeletonVariant` | `'text'` | Shape variant              |
| `count`             | `number`          | `1`      | Number of items            |
| `shimmer`           | `boolean`         | `true`   | Enable shimmer signal      |
| `shimmerDurationMs` | `number`          | `1500`   | Shimmer animation duration |

Returns `SkeletonState`:
| Member | Type | Description |
|--------|------|-------------|
| `isActive` | `Signal<boolean>` | Visibility |
| `variant` | `Signal<SkeletonVariant>` | Current shape |
| `count` | `Signal<number>` | Item count |
| `shimmer` | `Signal<{active, durationMs}>` | Shimmer state |
| `show()` / `hide()` | `() => void` | Toggle visibility |
| `setVariant(v)` | `(SkeletonVariant) => void` | Change shape |
| `setCount(n)` | `(number) => void` | Change count |

### `bindLoading(skeleton, loading)`

Bridges any `Signal<boolean>` to skeleton visibility via `effect()`.

### `SkeletonVariant`

`'text' | 'text-short' | 'circle' | 'avatar' | 'card' | 'table-row' | 'table-header' | 'custom'`

## Scope Boundaries

| Concern                          | Status                       |
| -------------------------------- | ---------------------------- |
| Headless skeleton state signals  | ✅                           |
| Shimmer animation signal         | ✅                           |
| Async-state bridge (bindLoading) | ✅                           |
| Shape variants (8 types)         | ✅                           |
| CSS animations / rendering       | ❌ (consumer responsibility) |
| Design token sizing integration  | ❌ (consumer responsibility) |
