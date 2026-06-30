---
id: feature-angular-hydration
type: feature
status: proposed
created: 2026-06-30
package: '@hexguard/angular-hydration'
---

# @hexguard/angular-hydration

## Summary

Headless SSR hydration state — mismatch detection, deferred hydration signals, selective hydration control, and hydration diagnostics. For production SSR apps that need hydration visibility.

## Pain Point

Angular SSR hydration is a black box. When hydration mismatches occur (server rendered X, client expected Y), Angular logs a cryptic message and sometimes silently fails. There's no signal-based hydration status ("has this component hydrated yet?"), no way to defer non-critical hydration, and no diagnostics for why hydration failed.

## Goals

- Hydration status signal per component (pending, hydrating, hydrated, error)
- Hydration mismatch detection with structured error data
- Deferred hydration triggers (on idle, on visible, on interaction)
- Selective hydration control (hydrate critical path first)
- Hydration timing metrics (time-to-hydrate per component)
- Development-mode hydration mismatch visualization

## Non-Goals

- No replacement for Angular's hydration engine
- No server-side rendering logic
- No rendered hydration indicators

## Proposed Public API

```typescript
// Hydration status
export function injectHydration(): {
  readonly status: Signal<'pending' | 'hydrating' | 'hydrated' | 'mismatch' | 'error'>;
  readonly mismatch: Signal<HydrationMismatch | null>;
  readonly metrics: Signal<HydrationMetrics>;
};

export interface HydrationMismatch {
  component: string;
  nodePath: string;
  serverValue: unknown;
  clientValue: unknown;
  timestamp: Date;
}

export interface HydrationMetrics {
  timeToHydrateMs: number;
  mismatchCount: number;
  hydratedAt: Date | null;
}

// Deferred hydration
export function provideDeferredHydration(config: {
  triggers: ('idle' | 'visible' | 'interaction' | 'delay')[];
  delayMs?: number;
  selector?: string;
}): Provider[];

// Selective hydration
@Component({...})
export class HeavyComponent {
  readonly hydration = injectHydration();
  // Component hydrates when idle (non-blocking)
}
```

## Implementation Plan
1. Scaffold `angular/packages/angular-hydration/`.
2. Implement hydration status signals, mismatch detection, deferred triggers.
3. Add selective hydration control and timing metrics.
4. Add tests. Register in workspace.
