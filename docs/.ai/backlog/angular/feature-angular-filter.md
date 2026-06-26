---
id: feature-angular-filter
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-filter'
---

# @hexguard/angular-filter

## Summary

Headless multi-filter state for Angular — compose text search, multi-select checkboxes, date ranges, dropdown selects, and toggle filters into a unified filter state with URL sync, active-filter count, and individual filter reset. Every data-heavy page (tables, lists, dashboards, reports) has a filter bar with multiple filter types, yet every team composes the same pattern manually.

**Relationship to existing packages:**
- `angular-url-state` handles primitive query params — this composes multiple filters into a higher-level state.
- `angular-query-form` handles Reactive Forms binding to URL — this is filter-specific with filter types.
- `angular-search` handles autocomplete/finder search — this is about **filtering** a known dataset, not searching.

## Competition Check

No headless Angular multi-filter state package exists. Apps either compose their own from `angular-url-state` or use UI library filter components.

## Why Wide Adoption

Filter bars are the most common UI pattern on data pages: a text search input, 3–5 dropdown/checkbox filter groups, a date range picker, and a "Clear all" button. Each filter updates the URL and triggers a data reload. The state management (which filters are active, how many, which changed, URL sync, reset individual/all) is identical across every app.

## Goals

1. Provide `injectFilterGroup()` — typed filter group state with multiple filter definitions and URL sync.
2. Support filter types: text, select (single), multi-select, checkbox-group, date-range, toggle.
3. Auto-sync all filters to URL query params (opt-in per filter).
4. Expose `activeFilters` signal — count and list of currently active (non-default) filters.
5. Support `resetFilter(id)` and `resetAll()` — individual and bulk reset.
6. Support `hasChanges` — compare current to initial values.
7. Support `isEmpty` — all filters at default/empty state.

## Non-Goals

- No filter UI components (consumer renders their own inputs/dropdowns).
- No filter-param-dependent-reset logic (compose with `angular-query-form` for that).
- No async filter options loading (consumer provides static or signal-based options).

## Proposed Public API

```typescript
// ── Types ─────────────────────────────────────────────────

export type FilterType = 'text' | 'select' | 'multi-select' | 'checkbox-group' | 'date-range' | 'toggle';

export interface FilterDefinition<T = unknown> {
  id: string;
  type: FilterType;
  label: string;
  defaultValue: T;
  options?: { value: T; label: string }[];       // For select/multi-select/checkbox-group
  urlParam?: string;                               // Override URL param key (default: id)
  syncToUrl?: boolean;                             // Default: true
}

export interface FilterGroupConfig {
  filters: FilterDefinition[];
  urlSync?: boolean;                               // Global toggle (default: true)
}

export interface FilterState {
  readonly values: Signal<Record<string, unknown>>;          // All filter values
  readonly activeFilters: Signal<FilterChip[]>;              // Non-default filters
  readonly activeCount: Signal<number>;
  readonly hasChanges: Signal<boolean>;
  readonly isEmpty: Signal<boolean>;

  getValue<T>(id: string): Signal<T>;
  setValue(id: string, value: unknown): void;
  resetFilter(id: string): void;
  resetAll(): void;

  readonly urlParams: Signal<Record<string, string | string[]>>;
  readonly onChange: Signal<{ id: string; value: unknown } | null>;
}

export interface FilterChip {
  id: string;
  label: string;
  displayValue: string;
  onRemove: () => void;
}

// ── Factory ───────────────────────────────────────────────

export function injectFilterGroup(config: FilterGroupConfig): FilterState;
```

## Implementation Plan

1. Scaffold `angular/packages/angular-filter/` following the standard pattern.
2. Implement `FilterDefinition`, `FilterGroupConfig`, `FilterState` types.
3. Implement individual filter state per type (text, select, multi-select, checkbox-group, date-range, toggle).
4. Implement URL sync integration with `angular-url-state` (optional peer dependency).
5. Implement `activeFilters`, `hasChanges`, `isEmpty` computed signals.
6. Implement reset and clear operations.
7. Add tests: each filter type, URL sync, active filter count, reset individual/all, hasChanges detection.
8. Create demo page.
9. Register in workspace, build scripts, and catalog.
