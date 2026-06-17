---
id: feature-angular-empty-state
type: feature
status: proposed
created: 2026-06-17
package: '@hexguard/angular-empty-state'
---

# Angular Empty State Package

## Summary

Design `@hexguard/angular-empty-state` as a headless Angular package for standardizing empty-state display contracts for zero-result, no-data, empty-collection, and error-recovery screens with contextual messaging, action slots, and optional illustration integration.

The repeated problem is that nearly every list, table, search result, or filtered view in a business app needs an empty state — "no results found," "no items yet," "select a filter to begin" — yet every team builds the same conditional message, illustration slot, and action-button pattern from scratch, with inconsistent messaging and accessibility.

## Goals

- Provide a headless `emptyState()` factory that generates signal-driven empty-state config objects from a type discriminator (`noResults`, `noData`, `empty`, `filtered`, `error`, `search`).
- Support contextual title, description, action label, and action callback per empty-state type.
- Support custom empty-state definitions for app-specific scenarios.
- Provide convenience helpers that compose with async-state (`isEmptyOnEmpty()`, `isErrorOnError()`) for automatic empty-state switching.
- Keep the package rendering-agnostic — no DOM, no CSS, no icons.
- Provide default title/description text in English for each built-in type, overridable by the consumer.

## Non-Goals

- Shipping illustration SVGs or icon components.
- Layout or centering CSS — the consumer's design system owns positioning.
- Replacing error boundaries or error handling — empty-state is for data absence, not crashes.
- Animating empty-state transitions.

## Decisions

- Treat empty-state as a data-driven config object, not a component.
- Expose a type discriminator as a string literal union for IDE autocompletion.
- Keep built-in types generic enough for most business apps but overrideable via options.
- Compose with async-state signals via the `fromAsyncState()` helper that watches `isEmpty()` and `isError()`.
- English defaults are provided inline — no i18n infrastructure (the consumer overrides text for localization).

## Proposed Public API

```ts
import { emptyState, fromAsyncState, type EmptyStateConfig, type EmptyStateType } from '@hexguard/angular-empty-state';

// Standalone empty state
const state = emptyState('noResults', {
  title: 'No matching products',
  description: 'Try adjusting your search or filter criteria.',
  actionLabel: 'Clear filters',
  action: () => clearFilters(),
});

const config: Signal<EmptyStateConfig> = state.config;
// → { type: 'noResults', title: '...', description: '...', actionLabel: '...', action: fn }

// Automatic from async-state
import { injectAsyncValue } from '@hexguard/angular-async-state';

const data = injectAsyncValue(...);
const searchState = fromAsyncState(data, {
  searching: { title: 'No matching results', actionLabel: 'Clear search' },
  empty: { title: 'No items yet', actionLabel: 'Add your first item' },
  error: { title: 'Failed to load', actionLabel: 'Retry' },
});

// Now searchState.config changes automatically:
//   data.isLoading() && data.isEmpty() → 'searching'
//   !data.isLoading() && data.isEmpty() → 'empty'
//   data.isError() → 'error'

// Built-in empty state types
type EmptyStateType =
  | 'noResults'     // search/filter returned zero results
  | 'noData'        // collection exists but has no items
  | 'empty'         // generic empty state
  | 'filtered'      // all items filtered out
  | 'error'         // failed to load
  | 'search'        // waiting for initial search input
  | 'custom';       // app-defined

// Config object
interface EmptyStateConfig {
  type: EmptyStateType;
  title: string;
  description?: string;
  actionLabel?: string;
  action?: () => void;
}

// Return type
interface EmptyStateHandle {
  readonly config: Signal<EmptyStateConfig>;
}
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold the publishable Angular library under `angular/packages/angular-empty-state/` following existing conventions.
2. Add build and test scripts to `angular/package.json` (`build:lib:empty-state`, `test:lib:empty-state`).

### Phase 1: Core Implementation

3. Define `EmptyStateType` union and `EmptyStateConfig` interface with English defaults for each built-in type.
4. Implement `emptyState(type, overrides?)` factory returning a `Signal<EmptyStateConfig>`.
5. Implement `fromAsyncState()` helper that watches async-state signals and switches empty-state type automatically.
6. Add unit tests for: all built-in types, custom overrides, action callback invocation, fromAsyncState type switching (loading→empty, loading→error, empty→hasData, error→reload), and fallback defaults.

### Phase 2: Demo & Docs

7. Add a demo route at `/packages/angular-empty-state` showing:
   - All built-in empty-state types with contextual messages
   - Integration with async-state (load empty list, load error, clear)
   - Custom empty state with illustration slot and action
8. Add Playwright coverage for the demo page.
9. Write the deep-dive doc at `docs/packages/angular-empty-state.md`.
10. Update the npm-facing `README.md`.

### Phase 3: Release

11. Add `verify:package:empty-state` to `angular/package.json`.
12. Add `.github/workflows/release-angular-empty-state.yml`.
13. Run `pnpm test:ci` and `pnpm build` for the full validation gate.

## Validation

- `pnpm test:lib:empty-state` — unit tests for type switching, overrides, async-state composition.
- `pnpm build:lib` — package builds.
- `pnpm test:app` — demo compiles.
- `pnpm test:e2e` — Playwright for demo interactions.
- `pnpm verify:package:empty-state` — tarball smoke test.

## Follow-Ups

- Evaluate whether illustration/icon presets belong in a companion package or separate design-system integration.
- Revisit i18n support for default messages if internationalization demand emerges.
