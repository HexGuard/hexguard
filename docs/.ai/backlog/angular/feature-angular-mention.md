---
id: feature-angular-mention
type: feature
status: proposed
created: 2026-06-25
package: '@hexguard/angular-mention'
---

# @hexguard/angular-mention

## Summary

Headless mention/autocomplete detection for Angular text inputs and contenteditable areas — detect trigger characters (`@`, `#`, `:`) as the user types, filter a candidate list, and handle selection and insertion. Mention inputs appear in chat apps, comment forms, document editors, and social-media-style input boxes, yet every team re-implements the same trigger detection and popover positioning logic.

**Competition check:** No headless Angular mention package exists. Existing solutions (ngx-mention, angular-mentions) are directive-only, tightly coupled to textarea elements, and lack signal-based state.

## Why Wide Adoption

Mention inputs (`@username`, `#channel`, `:emoji_name:`, `#ticket`) are a universal UX pattern in collaborative apps, support tools, project management, and social features. Every team building communication features re-implements the same trigger → search → highlight → insert → reset pipeline.

## Goals

1. Provide `injectMention()` — mention detection state for text inputs and contenteditable.
2. Detect trigger characters and capture the search query after the trigger.
3. Expose signals: `isOpen`, `query`, `triggerChar`, `position` (for popover placement).
4. Support custom trigger characters with configurable patterns.
5. Provide `select(item)` — replace the trigger+query text with the selected item's display text.
6. Support keyboard navigation (ArrowUp/Down, Enter, Escape) within the suggestion list.
7. Support both `<textarea>` and `contenteditable` modes.

## Non-Goals

- No popover/tooltip UI component (headless — consumer positions their own suggestions list).
- No async candidate loading (consumer provides candidates array or signal).
- No emoji/icon rendering inside mentions.

## Decisions

1. **Text range manipulation**: Uses `HTMLInputElement.selectionStart`/`selectionEnd` for textarea mode, `document.getSelection()` + range APIs for contenteditable mode.
2. **Trigger detection**: Scans backwards from cursor position for trigger characters — configurable via regex pattern per trigger.
3. **Mode detection**: Auto-detect textarea vs contenteditable based on the host element type.

## Proposed Public API

```typescript
// ── Types ─────────────────────────────────────────────────

export interface MentionTrigger {
  char: string;                               // '@', '#', ':'
  pattern?: RegExp;                           // Pattern for valid mention chars after trigger
  minLength?: number;                         // Min chars before searching (default: 1)
}

export interface MentionConfig {
  triggers: MentionTrigger[];                 // Default: [{ char: '@' }]
  candidates: string[] | Signal<string[]>;
  displayTransform?: (item: string) => string; // What to insert on select
  trackBy?: (item: string) => string;
}

export interface MentionState {
  readonly isActive: Signal<boolean>;
  readonly triggerChar: Signal<string | null>;
  readonly query: Signal<string>;
  readonly cursorPosition: Signal<{ top: number; left: number } | null>;
  readonly filteredCandidates: Signal<string[]>;
  readonly highlightedIndex: Signal<number>;

  select(index: number): void;
  cancel(): void;
  highlightNext(): void;
  highlightPrev(): void;

  // Call this from input/selectionchange
  handleInput(element: HTMLInputElement | HTMLElement): void;
}

// ── Factory ───────────────────────────────────────────────

export function injectMention(config: MentionConfig): MentionState;
```

## Implementation Plan

1. Scaffold `angular/packages/angular-mention/` following the standard pattern.
2. Implement `MentionTrigger`, `MentionConfig`, `MentionState`.
3. Implement trigger detection (backwards scan from cursor).
4. Implement candidate filtering and keyboard navigation.
5. Implement text insertion for textarea and contenteditable modes.
6. Add tests: trigger detection, filtering, selection, keyboard nav, edge cases (empty query, no candidates, cursor at start).
7. Create demo page.
8. Register in workspace, build scripts, and catalog.
