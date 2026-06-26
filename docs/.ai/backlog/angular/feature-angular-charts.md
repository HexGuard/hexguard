---
id: feature-angular-charts
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-charts'
---

# @hexguard/angular-charts

## Summary

Headless chart interaction state for Angular — track hover, selection, zoom, drill-down, legend toggle, and tooltip position independent of any chart rendering library. Every dashboard and analytics UI needs chart interactivity; this separates interaction state from rendering.

**Competition check:** No headless chart interaction state package exists. Chart libraries (Chart.js, D3, Highcharts, ECharts) handle their own interactions but don't expose a reusable, library-agnostic interaction state.

## Why Wide Adoption

Dashboards have charts everywhere: bar charts, line charts, pie charts, scatter plots. Every chart needs hover detection, click/tap selection, drill-down navigation, legend toggling, and tooltip positioning. A headless interaction state works with any chart rendering library.

## Goals

1. Provide `injectChartInteraction()` — chart interaction state.
2. Track hover state per data point with signal-based updates.
3. Track selection (clicked/tapped data point) with `selected` signal.
4. Support drill-down history (click to drill, back button to return).
5. Support legend toggle state (which series are visible).
6. Support tooltip position signals for absolute positioning.

## Proposed Public API

```typescript
export interface ChartDataPoint {
  id: string;
  series: string;
  category: string;
  value: number;
  metadata?: Record<string, unknown>;
}

export interface ChartConfig {
  drillEnabled?: boolean;
  selectionMode?: 'none' | 'single' | 'multi';
}

export interface ChartInteractionState {
  readonly hovered: Signal<ChartDataPoint | null>;
  readonly selected: Signal<ChartDataPoint | null>;
  readonly tooltip: Signal<{ x: number; y: number; data: ChartDataPoint } | null>;
  readonly legend: Signal<Record<string, boolean>>;       // series → visible
  readonly drillStack: Signal<ChartDataPoint[]>;
  readonly isDrilled: Signal<boolean>;

  hover(point: ChartDataPoint | null, x?: number, y?: number): void;
  select(point: ChartDataPoint | null): void;
  drillDown(point: ChartDataPoint): void;
  drillUp(): void;
  toggleSeries(series: string): void;
  clearSelection(): void;
}

export function injectChartInteraction(config?: ChartConfig): ChartInteractionState;
```

## Implementation Plan

1. Scaffold `angular/packages/angular-charts/`.
2. Implement interaction state with signals.
3. Implement drill-down stack with history.
4. Add tests.
5. Register in workspace.
