---
id: feature-angular-notifications
type: feature
status: proposed
created: 2026-06-17
package: '@hexguard/angular-notifications'
---

# Angular Notifications Package

## Summary

Design `@hexguard/angular-notifications` as a headless Angular package for standardizing toast, snackbar, and alert notification queues across Angular apps.

The repeated problem is that most business apps need a notification queue (success toasts, error alerts, info snackbars) and every team rebuilds the same stacking, timeout, pause-on-hover, dismiss-all, and accessibility behavior on each screen.

## Goals

- Provide a headless notification queue contract with push, dismiss, dismiss-all, and replace operations.
- Support configurable timeout, max-visible stacking strategy, and pause-on-hover behavior.
- Keep the core package completely UI-agnostic — no template, no component, no CSS.
- Compose with async-state action results (e.g., "on action failure, push error toast").
- Include built-in accessibility semantics (role="alert", aria-live) in the state contract.
- Define an optional injectable renderer adapter interface for app-specific toast rendering.

## Non-Goals

- Shipping a UI design system or component library.
- Replacing confirmation dialogs or modal workflows.
- Building a server-pushed notification feed (that's the cross-stack NotificationDelivery pair).

## Decisions

- Prefer a headless state-model first over a UI component library.
- Keep the renderer adapter optional — apps can use the signals directly without it.
- Treat notification identity, type (success, error, warning, info), and role as explicit fields.
- Compose with async-state rather than duplicating action lifecycle state.
- Keep the API surface narrow: one queue facade, one renderer interface, one set of state signals.

## Proposed Public API

```ts
import { injectNotificationQueue, type Notification, type NotificationOptions } from '@hexguard/angular-notifications';

// Type of notification
type NotificationType = 'success' | 'error' | 'warning' | 'info';

// Core notification model
interface Notification<TMeta = undefined> {
  id: string;
  type: NotificationType;
  message: string;
  detail?: string;
  timeout?: number;           // ms, 0 = sticky
  meta?: TMeta;
  createdAt: number;
}

// Queue configuration
interface NotificationQueueConfig {
  maxVisible?: number;        // default 5
  defaultTimeout?: number;    // default 5000
  pauseOnHover?: boolean;     // default true
}

// Injected facade
interface NotificationQueue {
  readonly visible: Signal<Notification[]>;
  readonly queue: Signal<Notification[]>;

  push(notification: NotificationOptions): string;   // returns id
  dismiss(id: string): void;
  dismissAll(): void;
  dismissType(type: NotificationType): void;
  replace(id: string, updates: Partial<NotificationOptions>): void;
}
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold the publishable Angular library under `angular/packages/angular-notifications/` following the same conventions as `angular-api-errors` (package.json, ng-package.json, tsconfig.lib.json, tsconfig.lib.prod.json, tsconfig.spec.json, `angular.json` project registration).
2. Add build and test scripts to `angular/package.json` (`build:lib:notifications`, `test:lib:notifications`).
3. Register the package in `scripts/package-catalog.data.mjs` as a planned (not just proposed) package.
4. Run `pnpm catalog:sync` to update docs.

### Phase 1: Core State Model

5. Define `NotificationType`, `Notification<TMeta>`, `NotificationOptions` types.
6. Implement `notificationQueue()` signal-based factory with push, dismiss, dismiss-all, dismiss-type, and replace operations.
7. Implement configurable timeout tracking per notification with auto-dismiss on expiry.
8. Implement max-visible stacking with automatic queue-to-visible promotion when items are dismissed.
9. Implement pause-on-hover behavior (pause/resume timeouts).
10. Add unit tests for queue operations, timeout behavior, stacking, pause-on-hover, dismiss-all, dismiss-type, replace, and edge cases (empty queue, rapid push/dismiss).

### Phase 2: Renderer Adapter

11. Define `NotificationRenderer` abstract class or interface with a `render(notification: Signal<Notification[]>)` method.
12. Implement `provideNotificationRenderer()` provider function.
13. Add a default console renderer for development (logs notifications to console).
14. Add tests for the adapter contract.

### Phase 3: Demo & Docs

15. Add a demo route at `/packages/angular-notifications` showing push, dismiss, dismiss-all, and type examples.
16. Add Playwright coverage for the demo page.
17. Write the deep-dive doc at `docs/packages/angular-notifications.md`.
18. Update the npm-facing `README.md` with quickstart and API reference.

### Phase 4: Release

19. Add `verify:package:notifications` to `angular/package.json`.
20. Add `.github/workflows/release-angular-notifications.yml` following the existing release workflow pattern.
21. Run `pnpm test:ci` and `pnpm build` for the full validation gate.

## Validation

- `pnpm test:lib:notifications` — unit tests for queue state and timeout behavior.
- `pnpm build:lib` — package builds successfully.
- `pnpm test:app` — demo app compiles.
- `pnpm test:e2e` — Playwright coverage for demo interactions.
- `pnpm verify:package:notifications` — tarball smoke test.

## Follow-Ups

- Revisit whether optional template/component helpers belong in the same package or a companion package.
- Revisit server-pushed notification feed integration with the cross-stack `HexGuard.NotificationDelivery` pair.
- Evaluate overlap with `angular-confirmation` once both packages exist.
