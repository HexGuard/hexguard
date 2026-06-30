---
id: feature-angular-devtools
type: feature
status: proposed
created: 2026-06-30
package: '@hexguard/angular-devtools'
---

# @hexguard/angular-devtools

## Summary

Headless developer tools — signal state inspector, component tree explorer, change detection attribution log, and dependency injection visualizer. Production-stripped dev instrumentation.

## Pain Point

Debugging Angular apps means console.log-ing signals, guessing why components re-render, and tracing DI chains manually. There's no equivalent to Redux DevTools for Angular signals — no state snapshot, no diff view, no time-travel. Change detection is a black box: you see performance issues but don't know which component triggered the cycle or why.

## Goals

- Signal value inspector (browse all signals, see current values, watch changes)
- Component tree state (active components, inputs, outputs, lifecycle)
- Change detection attribution (which event/input triggered a CD cycle)
- DI dependency graph visualization data
- Development-only — stripped from production builds
- Console API for programmatic inspection

## Non-Goals

- No browser extension or DevTools panel
- No production monitoring
- No replacement for Angular DevTools extension

## Proposed Public API

```typescript
// Enable in development
provideDevTools({
  signalInspector: true,     // window.__ngDevTools.signals
  componentTree: true,       // window.__ngDevTools.components
  cdProfiler: true,          // window.__ngDevTools.cdLog
  diGraph: true,             // window.__ngDevTools.diGraph
});

// Console API (available at window.__ngDevTools)
interface NgDevTools {
  // Signals
  signals: {
    list(): { name: string; value: unknown; dependencies: string[] }[];
    watch(name: string, callback: (value: unknown) => void): () => void;
    snapshot(): Record<string, unknown>;
  };

  // Component tree
  components: {
    tree(): ComponentNode[];
    find(selector: string): ComponentNode | null;
  };

  // Change detection
  cdLog: {
    entries: CdLogEntry[];
    clear(): void;
    watch(callback: (entry: CdLogEntry) => void): () => void;
  };
}

interface ComponentNode {
  name: string;
  selector: string;
  inputs: Record<string, unknown>;
  outputs: string[];
  children: ComponentNode[];
  cdCycles: number;
}

interface CdLogEntry {
  component: string;
  trigger: 'input' | 'event' | 'async' | 'markForCheck' | 'timer';
  source?: string;
  durationMs: number;
  timestamp: Date;
}
```

## Implementation Plan
1. Scaffold `angular/packages/angular-devtools/`.
2. Implement signal inspector, component tree, CD profiler, DI graph.
3. Add console API, production stripping, lifecycle hooks.
4. Add tests. Register in workspace.
