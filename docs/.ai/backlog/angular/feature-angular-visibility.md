---
id: feature-angular-visibility
type: feature
status: proposed
created: 2026-06-17
package: '@hexguard/angular-visibility'
---

# Angular Visibility Package

## Summary

Design `@hexguard/angular-visibility` as a focused Angular package for standardizing document and element visibility tracking, tab-hidden detection, idle-timeout, and user-activity signals.

The repeated problem is that many Angular features depend on visibility state — pause polling when the tab is hidden, show "are you still there?" prompts after inactivity, pause animations when elements scroll out of view, and resume when the user returns. Every team rebuilds the same `document.visibilitychange` + `IntersectionObserver` + `mousemove`/`keydown` listeners with inconsistent cleanup and edge-case behavior.

## Goals

- Provide a single injectable facade (`injectVisibility()`) for document visibility state.
- Expose `isVisible: Signal<boolean>` for tab visibility (hidden vs visible).
- Expose `isIdle: Signal<boolean>` and `idleDuration: Signal<number>` for user inactivity detection.
- Expose `lastActivity: Signal<number>` timestamp for the last detected user interaction.
- Support configurable idle timeout with a custom activity event whitelist.
- Provide a standalone `inElementVisibility(elementRef)` function for IntersectionObserver-based element visibility.
- Keep the package dependency-free beyond `@angular/core` and `tslib`.

## Non-Goals

- Building a full user-engagement analytics system.
- Replacing `@angular/cdk/scrolling` viewport visibility for virtual scrolling.
- Audio or video playback visibility — those have browser-native handling.
- Element visibility for animation libraries — that's a rendering concern.

## Decisions

- Use `document.visibilityState` + `visibilitychange` event for tab visibility.
- Use `mousemove`, `keydown`, `mousedown`, `touchstart`, `scroll`, `wheel` as default activity events.
- Use `IntersectionObserver` for element visibility — return a simple `Signal<boolean>`.
- Default idle timeout to 60 seconds. Configurable via options. Set to `0` to disable idle tracking.
- Keep document-level and element-level visibility as separate exports — they have different use cases.

## Proposed Public API

```ts
import { injectVisibility, inElementVisibility } from '@hexguard/angular-visibility';

// Document/tab visibility + idle detection
@Component({ ... })
export class MyComponent {
  private readonly visibility = injectVisibility({ idleTimeoutMs: 120_000 });

  readonly isVisible = this.visibility.isVisible;       // Signal<boolean> — tab visible
  readonly isIdle = this.visibility.isIdle;             // Signal<boolean> — user inactive
  readonly idleDuration = this.visibility.idleDuration;  // Signal<number> — ms since last activity
  readonly lastActivity = this.visibility.lastActivity;  // Signal<number> — timestamp

  constructor() {
    // Pause polling when tab is hidden
    effect(() => {
      if (!this.isVisible()) {
        this.pausePolling();
      } else {
        this.resumePolling();
      }
    });
  }
}

// Element visibility
@Component({
  template: '<div #target>Track me</div>',
})
export class MyComponent {
  readonly target = viewChild.required<ElementRef>('target');
  readonly isElementVisible = inElementVisibility(this.target);

  constructor() {
    effect(() => {
      console.log('Element visible:', this.isElementVisible());
    });
  }
}

// Options
interface VisibilityOptions {
  idleTimeoutMs?: number;           // inactivity threshold (default 60000, 0 = disabled)
  activityEvents?: string[];        // events that reset idle timer
}

// Return types
interface VisibilityState {
  readonly isVisible: Signal<boolean>;
  readonly isIdle: Signal<boolean>;
  readonly idleDuration: Signal<number>;
  readonly lastActivity: Signal<number>;
}

// Element visibility — no options needed for the simple case
function inElementVisibility(elementRef: Signal<ElementRef | undefined>): Signal<boolean>;
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold the publishable Angular library under `angular/packages/angular-visibility/` following existing conventions.
2. Add build and test scripts to `angular/package.json` (`build:lib:visibility`, `test:lib:visibility`).

### Phase 1: Core Implementation

3. Implement `injectVisibility()` using Angular's `DestroyRef` for cleanup.
4. Implement `isVisible` signal bound to `document.visibilityState` + `visibilitychange` events.
5. Implement idle detection: track `lastActivity` timestamp from configurable event whitelist.
6. Implement `isIdle` signal that becomes `true` when no activity for `idleTimeoutMs`.
7. Implement `idleDuration` signal that counts ms since last activity (updates periodically while idle).
8. Implement `inElementVisibility()` using `InterservationObserver` that returns a `Signal<boolean>`.
9. Add unit tests for: tab show/hide transitions, idle timeout, activity reset, idle timer cleanup, element visibility observation, observer disconnect, multiple observers, and options defaults.

### Phase 2: Demo & Docs

10. Add a demo route at `/packages/angular-visibility` showing:
    - Tab visibility indicator with visual state
    - Idle timer countdown and "you are idle" state
    - Activity detection with visual feedback
    - Element visibility demo (scroll a target in and out of view)
    - Composition demo with network-status (pause polling when tab hidden OR offline)
11. Add Playwright coverage for the demo page.
12. Write the deep-dive doc at `docs/packages/angular-visibility.md`.
13. Update the npm-facing `README.md`.

### Phase 3: Release

14. Add `verify:package:visibility` to `angular/package.json`.
15. Add `.github/workflows/release-angular-visibility.yml`.
16. Run `pnpm test:ci` and `pnpm build` for the full validation gate.

## Validation

- `pnpm test:lib:visibility` — unit tests for visibility transitions, idle detection, element observation, cleanup.
- `pnpm build:lib` — package builds successfully.
- `pnpm test:app` — demo app compiles.
- `pnpm test:e2e` — Playwright coverage for demo interactions.
- `pnpm verify:package:visibility` — tarball smoke test.

## Follow-Ups

- Revisit whether a combined `@hexguard/angular-live-data` pause-on-hidden helper should use this package internally.
- Evaluate adding `document.prerendering` / `wasDiscarded` support for back/forward cache awareness.
- Consider an `inActivityEvents()` export that allows imperatively marking activity (useful for programmatic interactions).
