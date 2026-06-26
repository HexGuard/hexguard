---
id: feature-angular-tags
type: feature
status: proposed
created: 2026-06-25
package: '@hexguard/angular-tags'
---

# @hexguard/angular-tags

## Summary

Headless tag/chip input state for Angular — add tags by typing+Enter or selecting from a picker, remove by backspace/click, validate against constraints, and autocomplete from a suggestions list. Tag inputs appear in virtually every form with categorization, metadata, or multi-select fields (skills, categories, assignees, labels), yet every team rebuilds the same state management.

**Competition check:** No headless Angular tag/chip input state package exists. Existing solutions (ngx-chips, angular-tag-input) are opinionated UI widgets with baked-in styling.

## Why Wide Adoption

Tag input is one of the most common form patterns: email recipients (To: field), skill selectors, category pickers, label editors, assignee selectors, keyword inputs. Every app with form entry needs this. A headless approach separates state from UI, making it compatible with any design system.

## Goals

1. Provide `injectTags()` — tag collection state with add, remove, clear operations.
2. Support max tag limit, duplicate detection, and custom validation.
3. Support autocomplete suggestions with keyboard navigation (ArrowDown/Up, Enter to select).
4. Support backspace-to-remove (when input is empty) like email chips.
5. Provide input text signal for debounced autocomplete lookups.
6. Expose computed signals: `tags`, `remaining`, `hasError`, `errorMessage`, `suggestions`, `isValid`.

## Non-Goals

- No UI rendering — consumer provides their own tag/chip template and input element.
- No async data loading for suggestions (consumer provides filtered suggestions array).

## Decisions

1. **Validation pipeline**: Each tag passes through optional `validate(tag)` before adding. Returns `string | null` (error message or null=valid).
2. **Backspace removal**: When input is empty and user presses Backspace, remove the last tag.
3. **Duplicate detection**: Configurable — `allowDuplicates: boolean` (default false).

## Proposed Public API

```typescript
// ── Types ─────────────────────────────────────────────────

export interface TagsConfig {
  initialTags?: string[];
  max?: number;                              // Max number of tags (default: Infinity)
  allowDuplicates?: boolean;                 // Default: false
  validate?: (tag: string) => string | null; // Return error message or null
  separators?: string[];                     // Default: ['Enter', ',', ';']
  placeholder?: string;
}

export interface TagsState {
  // Signals
  readonly tags: Signal<string[]>;
  readonly input: Signal<string>;
  readonly remaining: Signal<number>;          // max - tags.length
  readonly hasError: Signal<boolean>;
  readonly errorMessage: Signal<string | null>;
  readonly isOverLimit: Signal<boolean>;
  readonly isDuplicate: Signal<boolean>;

  // Mutations
  add(tag: string): boolean;                   // Returns false if rejected
  remove(index: number): void;
  removeLast(): void;
  clear(): void;
  setInput(value: string): void;
}

export interface SuggestionState {
  readonly suggestions: Signal<string[]>;
  readonly isOpen: Signal<boolean>;
  readonly highlightedIndex: Signal<number>;

  setSuggestions(suggestions: string[]): void;
  highlightNext(): void;
  highlightPrev(): void;
  selectHighlighted(): void;
  close(): void;
}

// ── Factories ─────────────────────────────────────────────

export function injectTags(config?: TagsConfig): TagsState;
export function injectTagSuggestions(): SuggestionState;
```

## Implementation Plan

1. Scaffold `angular/packages/angular-tags/` following the standard pattern.
2. Implement `TagsConfig`, `TagsState`, `SuggestionState` types.
3. Implement `injectTags()` with add/remove/validation/duplicate detection.
4. Implement `injectTagSuggestions()` with keyboard navigation.
5. Add tests: add/remove, duplicate rejection, max limit, validation, backspace, suggestions keyboard nav.
6. Create demo page.
7. Register in workspace, build scripts, and catalog.
