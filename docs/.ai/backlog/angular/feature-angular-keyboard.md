---
id: feature-angular-keyboard
type: feature
status: proposed
created: 2026-06-25
package: '@hexguard/angular-keyboard'
---

# @hexguard/angular-keyboard

## Summary

Lightweight global keyboard shortcut registration for Angular — register/unregister key combinations with modifier keys and automatic cleanup on destroy. Unlike `@hexguard/angular-command-palette` (which is a full command registry with search, categories, and palette UI), this is a minimal primitive: register a callback for `Ctrl+S`, `Escape`, `Shift+?`, etc., and have it auto-cleaned when the component or directive is destroyed.

**Why separate from command-palette:** `angular-command-palette` is heavier — it manages a searchable command catalog, categorization, context-aware enablement, and palette open/close state. Many apps just need "when the user presses Escape, close the modal." That's a 2-line concern that shouldn't require a full command registry.

**Competition check:** Angular CDK does not provide keyboard shortcut registration. Third-party packages exist but are opinionated, outdated, or bundled with full hotkey systems.

## Goals

1. Provide `injectKeyboardShortcut()` — register a shortcut with auto-cleanup via `DestroyRef`.
2. Provide `KeyboardShortcutDirective` — declarative shortcut binding in templates.
3. Support modifier keys: `ctrl`, `shift`, `alt`, `meta`.
4. Support `preventDefault` option.
5. Support `description` for building keyboard shortcut help sheets.
6. Support `when` condition — only fire when a condition signal is true.

## Non-Goals

- No command registry or search (use `angular-command-palette` for that).
- No palette UI or overlay.
- No scoped shortcut contexts beyond the `when` condition.

## Decisions

1. **HostListener-based**: Uses Angular's `@HostListener('document:keydown')` under the hood for directives, and `Renderer2` + `DestroyRef` for the programmatic API.
2. **Signal condition**: The `when` parameter accepts `Signal<boolean>` — shortcuts are only active when the signal is `true`.

## Proposed Public API

```typescript
// ── Inject function ───────────────────────────────────────

export interface KeyboardShortcutConfig {
  key: string;                           // 's', 'Escape', 'F1', '?'
  modifiers?: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
  };
  description?: string;                  // For help/accessibility UI
  preventDefault?: boolean;             // Default: true
  when?: Signal<boolean>;               // Conditionally enable
}

export function injectKeyboardShortcut(
  config: KeyboardShortcutConfig,
  callback: () => void
): DestroyRef;  // call destroy() to manually unregister

// ── Directive ─────────────────────────────────────────────

@Component({
  selector: '[hexKeyboardShortcut]',
  standalone: true,
  host: {
    '(document:keydown)': 'handleKeydown($event)'
  }
})
export class KeyboardShortcutDirective {
  @Input({ alias: 'hexKeyboardShortcut', required: true }) shortcut!: KeyboardShortcutConfig;
  @Output() hexShortcut = new EventEmitter<void>();
}

// ── Usage ─────────────────────────────────────────────────

// Programmatic
@Component({})
class ModalComponent {
  constructor() {
    injectKeyboardShortcut(
      { key: 'Escape', description: 'Close modal', preventDefault: true },
      () => this.close()
    );
  }
}

// Declarative
<button [hexKeyboardShortcut]="{ key: 's', modifiers: { ctrl: true } }"
        (hexShortcut)="save()">
  Save (Ctrl+S)
</button>
```

## Implementation Plan

1. Scaffold `angular/packages/angular-keyboard/` following the standard pattern.
2. Implement `KeyboardShortcutConfig` type.
3. Implement `injectKeyboardShortcut()` with `Renderer2` + `DestroyRef`.
4. Implement `KeyboardShortcutDirective`.
5. Add tests: registration, modifiers, cleanup on destroy, conditional `when`.
6. Register in workspace, build scripts, and catalog.
