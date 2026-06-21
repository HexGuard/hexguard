# @hexguard/angular-visibility

Document and element visibility tracking for Angular: tab-hidden detection, idle-timeout, user-activity signals, and `IntersectionObserver`-based element visibility.

**[Deep package notes](https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-visibility.md)** ·
**[Demo routes](#demo-routes)** ·
**[Installation](#installation)**

## Installation

```bash
pnpm add @hexguard/angular-visibility
# No RxJS dependency required
```

## Quickstart

```ts
import { injectVisibility, inElementVisibility } from '@hexguard/angular-visibility';

@Component({ ... })
export class MyComponent {
  private readonly visibility = injectVisibility();
  readonly target = viewChild.required<ElementRef>('target');

  // Tab visibility
  readonly isVisible = this.visibility.isVisible;            // Signal<boolean>

  // Idle detection
  readonly isIdle = this.visibility.isIdle;                  // Signal<boolean>
  readonly idleDuration = this.visibility.idleDuration;      // Signal<number> (ms)
  readonly lastActivity = this.visibility.lastActivity;      // Signal<number> (timestamp)

  // Element visibility via IntersectionObserver
  readonly isElementVisible = inElementVisibility(this.target);

  constructor() {
    effect(() => {
      if (!this.isVisible()) this.pausePolling();
      else this.resumePolling();
    });
  }
}
```

## Features

| Feature                         | Status | Notes                                              |
| ------------------------------- | ------ | -------------------------------------------------- |
| Tab visibility tracking         | ✅     | Via `document.visibilityState` + `visibilitychange`|
| Idle detection (configurable)   | ✅     | Default 60s timeout, 0 to disable                  |
| `idleDuration` signal           | ✅     | Ms since last activity (updates periodically)      |
| `lastActivity` timestamp        | ✅     | Timestamp of last detected user interaction        |
| Custom activity events          | ✅     | Configurable event whitelist                       |
| Element visibility              | ✅     | Via `IntersectionObserver`, returns `Signal<boolean>`|
| Automatic cleanup               | ✅     | Via Angular `DestroyRef`                           |
| Zero extra dependencies         | ✅     | Only `@angular/core` + `tslib`                     |

## Demo routes

| Route                                                    | Description                                                   |
| -------------------------------------------------------- | ------------------------------------------------------------- |
| `/packages/angular-visibility`                           | Visibility package overview                                    |
| `/packages/angular-visibility/demo`                      | Tab visibility, idle detection, and element visibility demo    |

## What It Owns

- One injectable for document/tab visibility + idle detection
- One standalone function for element visibility via `IntersectionObserver`
- Configurable idle timeout and activity events
- Automatic `DestroyRef` cleanup for all listeners and observers

## What It Does Not Own

- User-engagement analytics or session tracking
- Virtual scrolling viewport visibility — see `@angular/cdk/scrolling`
- Audio/video playback visibility — browser-native
- Scroll-driven animations — that's a rendering concern

## API Reference

### `injectVisibility(options?)`

Creates a document-level visibility and idle detection handle.

**Parameters:**

- `options.idleTimeoutMs?: number` — Inactivity threshold in ms (default 60000, 0 = disabled).
- `options.activityEvents?: string[]` — Events that reset the idle timer. Default: `['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll', 'wheel']`.

**Returns:** `VisibilityState`

### `VisibilityState`

```ts
interface VisibilityState {
  readonly isVisible: Signal<boolean>;
  readonly isIdle: Signal<boolean>;
  readonly idleDuration: Signal<number>;
  readonly lastActivity: Signal<number>;
}
```

### `inElementVisibility(elementRef)`

Returns a `Signal<boolean>` that is `true` when the element is intersecting the viewport.

**Parameters:**

- `elementRef: Signal<ElementRef | undefined>` — A signal returning an `ElementRef` or `undefined`.

**Returns:** `Signal<boolean>`
