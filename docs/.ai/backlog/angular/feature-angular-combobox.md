---
id: feature-angular-combobox
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-combobox'
---

# @hexguard/angular-combobox

## Summary

Headless combobox/autocomplete state for Angular — select a value from a filtered list by typing and navigating with keyboard arrows. This is distinct from `@hexguard/angular-search` (which models a query→results search flow for finder UIs). A combobox is a **form input** that lets users type to filter options and select one (or multiple) values — like `<select>` with search, email address inputs, product/category pickers, and tag-style multi-select.

**Relationship to `angular-search`:** Search is for "type a query, get search results" (asynchronous, often paginated). Combobox is for "type to filter a known options list, pick a value" (synchronous client-side filtering, single or multi select). They serve different UI patterns.

**Competition check:** No headless Angular combobox state package exists. Angular CDK has no combobox primitive. Existing solutions are opinionated UI components (primeng dropdown, material autocomplete).

## Why Wide Adoption

Combobox is one of the most common form patterns in business apps: customer selector, product picker, category dropdown-with-search, assignee selector, country/state picker, email-to field, tag input. Every team re-implements options filtering, keyboard navigation, open/close, highlight management, and accessibility.

## Goals

1. Provide `injectCombobox()` — headless combobox state with filtering, selection, keyboard nav, and open/close.
2. Support single and multi selection modes.
3. Support client-side filtering with configurable filter function (default: case-insensitive contains).
4. Support async options loading via `options` signal.
5. Provide keyboard navigation: ArrowDown/Up to highlight, Enter to select, Escape to close, Tab to confirm.
6. Expose accessibility attributes (aria-expanded, aria-activedescendant, role="combobox").
7. Support `createIfNotFound` — allow entering a value not in the options list (free-text).

## Non-Goals

- No dropdown/overlay UI component (headless — consumer renders their own).
- No debounced input (compose with `angular-debounce`).
- No virtual scrolling for large lists.

## Proposed Public API

```typescript
// ── Types ─────────────────────────────────────────────────

export interface ComboboxConfig<T> {
  options: T[] | Signal<T[]>;
  displayFn: (item: T) => string;                   // How to display each option
  filterFn?: (query: string, item: T) => boolean;   // Default: case-insensitive contains
  selectionMode?: 'single' | 'multi';               // Default: single
  createIfNotFound?: boolean;                       // Allow free-text entry
  initialValue?: T | T[];
}

export interface ComboboxState<T> {
  // Signals
  readonly isOpen: Signal<boolean>;
  readonly query: Signal<string>;
  readonly filteredOptions: Signal<T[]>;
  readonly highlightedIndex: Signal<number>;
  readonly selectedValue: Signal<T | null>;         // Single select
  readonly selectedValues: Signal<T[]>;             // Multi select
  readonly highlightedOption: Signal<T | null>;

  // Input lifecycle
  open(): void;
  close(): void;
  toggle(): void;
  setQuery(value: string): void;
  clearQuery(): void;

  // Selection
  selectHighlighted(): void;
  select(value: T): void;
  deselect(value: T): void;
  clearSelection(): void;

  // Keyboard navigation
  highlightNext(): void;
  highlightPrev(): void;
  highlightFirst(): void;
  highlightLast(): void;

  // Keyboard handler (call from @keydown)
  handleKeyDown(event: KeyboardEvent): void;

  // Accessibility
  readonly comboboxId: string;
  readonly listboxId: string;
  readonly activedescendantId: Signal<string | null>;
}

// ── Factory ───────────────────────────────────────────────

export function injectCombobox<T>(config: ComboboxConfig<T>): ComboboxState<T>;
```

## Implementation Plan

1. Scaffold `angular/packages/angular-combobox/` following the standard pattern.
2. Implement `ComboboxConfig`, `ComboboxState` types.
3. Implement filtering logic with configurable filter function.
4. Implement open/close, highlight management, and selection.
5. Implement keyboard navigation (Arrow, Enter, Escape, Tab, Home, End).
6. Implement accessibility attributes generation.
7. Add tests: filtering, single/multi selection, keyboard nav, open/close, async options, free-text mode.
8. Create demo page.
9. Register in workspace, build scripts, and catalog.
