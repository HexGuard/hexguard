# @hexguard/angular-visibility

**Document and element visibility tracking for Angular.** Tab-hidden detection, idle-timeout, user-activity signals, and `IntersectionObserver`-based element visibility — no RxJS required.

**[Deep package notes](docs/packages/angular-visibility.md)** · **[Demo](/packages/angular-visibility/demo)**

---

## Problem

Apps need to pause/resume background work (polling, animations, websockets) when the tab is hidden, detect when users are idle for UI dimming or session timeout, and know when elements scroll into the viewport for lazy-loading or analytics. Each concern requires separate browser APIs (`visibilitychange`, user activity events, `IntersectionObserver`) with manual add/removeEventListener plumbing.

**`@hexguard/angular-visibility`** combines all three into a single injectable with automatic `DestroyRef` cleanup — tab visibility, idle detection, and element intersection.

## Installation

```bash
pnpm add @hexguard/angular-visibility
```

## Quickstart

```typescript
import { injectVisibility, inElementVisibility } from '@hexguard/angular-visibility';

@Component({...})
class DashboardComponent {
  private readonly v = injectVisibility({ idleTimeoutMs: 120_000 });

  readonly isTabVisible = this.v.isVisible;        // Signal<boolean>
  readonly isIdle = this.v.isIdle;                  // Signal<boolean>
  readonly idleDuration = this.v.idleDuration;      // Signal<number> (ms)
  readonly elVisible = inElementVisibility(this.myEl); // Signal<boolean>
}
```

## Use Cases

### Pause background work on tab switch
```typescript
effect(() => {
  if (!this.v.isVisible()) this.liveData.pause();
  else this.liveData.resume();
});
```

### Session timeout / UI dimming
```typescript
effect(() => {
  if (this.v.isIdle()) this.showIdleOverlay();
  else this.hideIdleOverlay();
});
```

### Lazy-load on scroll
```typescript
readonly loaded = signal(false);
effect(() => {
  if (this.elVisible() && !this.loaded()) {
    this.loaded.set(true);
    this.loadChunk();
  }
});
```

## API

### `injectVisibility(options?)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `idleTimeoutMs` | `number` | `60000` | Inactivity threshold (ms). `0` = disable idle detection |
| `activityEvents` | `string[]` | `['mousemove','keydown','mousedown','touchstart','scroll','wheel']` | Events that reset the idle timer |

### `VisibilityState`

| Signal | Type | Description |
|--------|------|-------------|
| `isVisible` | `Signal<boolean>` | Whether the document tab is currently visible |
| `isIdle` | `Signal<boolean>` | Whether the user has been inactive beyond the timeout |
| `idleDuration` | `Signal<number>` | Milliseconds since last user activity |
| `lastActivity` | `Signal<number>` | Timestamp of the last detected activity event |

### `inElementVisibility(elementRef)`

| Param | Type | Description |
|-------|------|-------------|
| `elementRef` | `Signal<ElementRef \| undefined>` | A signal returning the target element ref |
| Returns | `Signal<boolean>` | True when the element is intersecting the viewport |

## Scope Boundaries

| Concern | Status |
|---------|--------|
| Tab visibility tracking (`visibilitychange`) | ✅ |
| User idle detection (configurable timeout + events) | ✅ |
| Element viewport intersection (`IntersectionObserver`) | ✅ |
| User engagement analytics or session tracking | ❌ |
| Virtual scrolling viewport visibility | ❌ (use `@angular/cdk`) |

## Demo

Visit `/packages/angular-visibility/demo` for tab visibility, idle detection, and element visibility demos.

