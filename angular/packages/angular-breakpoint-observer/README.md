# @hexguard/angular-breakpoint-observer

**Signal-based reactive breakpoint detection for Angular.** Wraps `window.matchMedia` into typed breakpoint signals with `above`, `below`, `active`, and per-breakpoint helpers — no RxJS required.

**[Deep package notes](docs/packages/angular-breakpoint-observer.md)** · **[Demo](/packages/angular-breakpoint-observer/demo)**

---

## Problem

CSS media queries handle presentation, but component logic frequently needs to know the viewport size in TypeScript — show/hide table columns on mobile, switch layout orientation, choose responsive data-display mode, or adapt pagination size. Every team reinvents `matchMedia` listeners with manual cleanup, inconsistent breakpoint naming, and no standard comparison helpers.

**`@hexguard/angular-breakpoint-observer`** standardizes this into one injectable contract with automatic `DestroyRef` cleanup.

## Installation

```bash
pnpm add @hexguard/angular-breakpoint-observer
```

## Quickstart

```typescript
import { injectBreakpointObserver } from '@hexguard/angular-breakpoint-observer';

@Component({...})
class ResponsiveComponent {
  private readonly bp = injectBreakpointObserver();

  readonly active = this.bp.active;           // Signal<'sm' | 'md' | 'lg' | 'xl' | '2xl'>
  readonly isMobile = this.bp.below('md');    // Signal<boolean> — viewport < 768px
  readonly isDesktop = this.bp.above('lg');   // Signal<boolean> — viewport >= 1024px
  readonly columns = this.bp.breakpoints;     // { sm: Signal<boolean>, md: Signal<boolean>, ... }
}
```

## Use Cases

### Responsive data table columns

```typescript
// Show fewer columns on small viewports
readonly displayedColumns = computed(() => {
  if (this.bp.below('md')()) return ['name', 'status'];
  if (this.bp.below('lg')()) return ['name', 'status', 'date'];
  return ['name', 'status', 'date', 'assignee', 'actions'];
});
```

### Layout switching

```typescript
readonly layout = computed(() => this.bp.below('md')() ? 'stacked' : 'side-by-side');
```

### Custom breakpoint map

```typescript
const bp = injectBreakpointObserver({
  breakpoints: { narrow: 480, wide: 960, ultra: 1440 },
});
```

### Arbitrary media query

```typescript
readonly isLandscape = this.bp.matches('(orientation: landscape)');
```

## API

### `injectBreakpointObserver(options?)`

| Option        | Type                     | Default                                          | Description                       |
| ------------- | ------------------------ | ------------------------------------------------ | --------------------------------- |
| `breakpoints` | `Record<string, number>` | `{sm:640, md:768, lg:1024, xl:1280, '2xl':1536}` | Named breakpoint thresholds in px |

### `BreakpointObserver`

| Member           | Type                              | Description                                           |
| ---------------- | --------------------------------- | ----------------------------------------------------- |
| `active`         | `Signal<string>`                  | Name of the largest matching breakpoint               |
| `breakpoints`    | `Record<string, Signal<boolean>>` | One boolean signal per breakpoint name                |
| `above(name)`    | `(n) => Signal<boolean>`          | True when viewport width ≥ the named breakpoint value |
| `below(name)`    | `(n) => Signal<boolean>`          | True when viewport width < the named breakpoint value |
| `matches(query)` | `(q) => Signal<boolean>`          | Arbitrary CSS media query string evaluation           |

## Scope Boundaries

| Concern                                         | Status                            |
| ----------------------------------------------- | --------------------------------- |
| TypeScript viewport queries for component logic | ✅                                |
| CSS media query generation for stylesheets      | ❌ (use Tailwind or PostCSS)      |
| Element-level resize (`ResizeObserver`)         | ❌                                |
| Server-side rendering (`window` unavailable)    | ❌ guard with `isPlatformBrowser` |

## Demo

Visit `/packages/angular-breakpoint-observer/demo` for a live breakpoint playground with active/above/below/matches visualization.
