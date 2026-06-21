# @hexguard/angular-breakpoint-observer

Signal-based reactive breakpoint detection for Angular: wraps `window.matchMedia` into typed breakpoint signals with `above`/`below`/`active`/`matches` helpers.

**[Deep package notes](https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-breakpoint-observer.md)** ·
**[Demo routes](#demo-routes)** ·
**[Installation](#installation)**

## Installation

```bash
pnpm add @hexguard/angular-breakpoint-observer
# No RxJS dependency required
```

## Quickstart

```ts
import { injectBreakpointObserver } from '@hexguard/angular-breakpoint-observer';

@Component({ ... })
export class MyComponent {
  private readonly bp = injectBreakpointObserver();

  // Reactive signals
  readonly active = this.bp.active;           // Signal<'sm' | 'md' | 'lg' | 'xl' | '2xl'>
  readonly isMobile = this.bp.below('md');    // Signal<boolean> — viewport < 768px
  readonly isDesktop = this.bp.above('lg');   // Signal<boolean> — viewport >= 1024px
  readonly isTablet = this.bp.matches('(min-width: 768px) and (max-width: 1023px)');

  // Per-breakpoint signals
  readonly columns = this.bp.breakpoints;     // { sm: Signal<boolean>, md: Signal<boolean>, ... }
}
```

## Features

| Feature                            | Status | Notes                                              |
| -----------------------------------| ------ | -------------------------------------------------- |
| Active breakpoint signal           | ✅     | Largest matching breakpoint name                   |
| Per-breakpoint boolean signals     | ✅     | One signal per breakpoint in the map                |
| `above(name)` comparison           | ✅     | Viewport at or above the named breakpoint           |
| `below(name)` comparison           | ✅     | Viewport strictly below the named breakpoint        |
| `matches(query)` arbitrary queries | ✅     | Works with any CSS media query string               |
| Custom breakpoint maps             | ✅     | Override defaults with app-specific thresholds      |
| Tailwind-compatible defaults       | ✅     | `sm: 640`, `md: 768`, `lg: 1024`, `xl: 1280`, `2xl: 1536` |
| Zero extra dependencies            | ✅     | Only `@angular/core` + `tslib`                      |

## Demo routes

| Route                                                      | Description                                                   |
| ---------------------------------------------------------- | ------------------------------------------------------------- |
| `/packages/angular-breakpoint-observer`                    | Breakpoint Observer package overview                           |
| `/packages/angular-breakpoint-observer/demo`               | Breakpoint playground with active, above/below, and matches    |

## What It Owns

- One injectable breakpoint observer factory using `window.matchMedia`
- Reactive `active`, `above()`, `below()`, `matches()` signals
- `DestroyRef` cleanup for all media query listeners

## What It Does Not Own

- CSS media query generation — this is for TypeScript, not stylesheets
- Element-level resize observation — use `ResizeObserver` for that
- Server-side rendering — `window.matchMedia` is browser-only
- Responsive layout components — this is a headless primitive

## API Reference

### `injectBreakpointObserver(options?)`

Creates a breakpoint observer handle.

**Parameters:**

- `options?: BreakpointObserverOptions` — `{ breakpoints?: Record<string, number> }`. Defaults to `{ sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 }`.

**Returns:** `BreakpointObserver`

### `BreakpointObserver`

```ts
interface BreakpointObserver {
  readonly active: Signal<string>;
  readonly breakpoints: Record<string, Signal<boolean>>;
  above(name: string): Signal<boolean>;
  below(name: string): Signal<boolean>;
  matches(query: string): Signal<boolean>;
}
```
