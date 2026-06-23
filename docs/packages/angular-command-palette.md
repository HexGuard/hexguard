# @hexguard/angular-command-palette — Deep Package Notes

Headless command registry for Angular: register, search, and invoke commands with keyboard shortcuts, context-aware enablement, and palette open/close state.

## Problem

Productivity-focused apps keep rebuilding ad hoc shortcut registries, palette overlays, and context-aware command systems with inconsistent accessibility and routing behavior. Teams need a standard way to register commands, match keyboard shortcuts, and expose a searchable action palette — without coupling to a specific UI library.

**`@hexguard/angular-command-palette`** provides a headless command registry with shortcut indexing, text search, and palette state management. Palette UI components are deferred to a future version.

## API

- `injectCommandRegistry(options?)` — Returns a `CommandRegistryHandle` with:
  - `register(...commands)` — Register one or more commands
  - `unregister(id)` — Remove a command by ID
  - `getCommands(): Command[]` — List all registered commands
  - `search(query): Command[]` — Filter commands by title and category
  - `handleShortcut(event): boolean` — Match a KeyboardEvent against registered shortcuts, invoke if matched
  - `paletteOpen: Signal<boolean>` — Whether the palette is open
  - `openPalette()`, `closePalette()`, `togglePalette()` — Palette state controls
  - `Command` type: `{ id, title, shortcut?, category?, icon?, enabled?, invoke }`

---

## Assessment: Potential Improvements

| Area | Suggestion                                                                                                | Priority |
| ---- | --------------------------------------------------------------------------------------------------------- | -------- |
| API  | Consider adding fuzzy search (e.g., `"crt odr"` matches `"Create Order"`) in v0.2                         | Medium   |
| API  | Consider palette UI component (built-in overlay) in v0.2                                                  | Medium   |
| API  | Consider adding command groups / sections for the palette UI                                              | Low      |
| API  | Consider shortcut conflict detection on `register()` — warn when two commands share the same shortcut     | Low      |
| API  | Consider `onBeforeInvoke` / `onAfterInvoke` lifecycle hooks                                               | Low      |
| API  | Consider supporting nested command IDs for hierarchical organization (`"orders.create"`, `"orders.list"`) | Low      |

## Code Examples

### Register commands and handle shortcuts

```typescript
import { Component } from '@angular/core';
import { injectCommandRegistry } from '@hexguard/angular-command-palette';

@Component({ ... })
class AppShellComponent {
  private readonly registry = injectCommandRegistry();

  constructor() {
    this.registry.register(
      {
        id: 'order.create',
        title: 'Create Order',
        shortcut: 'Ctrl+Shift+N',
        category: 'Orders',
        invoke: () => this.router.navigate(['/orders/create']),
      },
      {
        id: 'dashboard',
        title: 'Go to Dashboard',
        shortcut: 'Ctrl+D',
        category: 'Navigation',
        invoke: () => this.router.navigate(['/dashboard']),
      },
    );
  }
}
// Ctrl+Shift+N anywhere in the app navigates to order creation.
// Ctrl+D navigates to dashboard.
```

### Search and invoke commands from a palette

```typescript
@Component({
  template: `
    <input #search (input)="query = search.value" placeholder="Search commands..." />
    <ul>
      @for (cmd of filteredCommands; track cmd.id) {
        <li (click)="cmd.invoke()">{{ cmd.title }}</li>
      }
    </ul>
  `,
})
class PaletteComponent {
  private readonly registry = injectCommandRegistry();
  query = '';

  get filteredCommands() {
    return this.registry.search(this.query);
  }
}
// As the user types, search() filters by title and category.
// Clicking a command invokes it directly.
```

## Related Resources

- [Package README](../../angular/packages/angular-command-palette/README.md)
- [Package Catalog](../README.md)
- [Demo Routes](../../angular/apps/demo-angular/src/app/features/packages/angular/angular-command-palette/)
- [Source Code](../../angular/packages/angular-command-palette/src/)

---

## API Review Findings

Review date: 2026-06-23. Findings are observational.

### Observations

| Dimension              | Finding                                                                                                                                                                                                                             | Severity |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Public API Design      | 1 function (`injectCommandRegistry`), 2 types. Headless — no UI coupling. Shortcut matching via event normalization. Commands registered with optional `enabled` signal.                                                            | praise   |
| Implementation Quality | Map-based command store. Shortcut index for O(1) matching. Global keydown listener with input-element exclusion. Meta/Ctrl handling for cross-platform compatibility. Auto-cleanup via DestroyRef.                                  | praise   |
| Implementation Quality | Search matches both title and category. Empty query returns all commands. Disabled commands are not invoked via shortcut but are still searchable.                                                                                  | praise   |
| Test Coverage          | 14 tests covering registration, unregister, multi-register, title search, category search, empty search, shortcut matching, unmatched shortcut, disabled command, palette open/close/toggle, initialOpen option, Meta key fallback. | praise   |
| Demo Integration       | Interactive demo with palette toggle, search input with real-time filtering, command display with shortcut/category labels, and last-invoked tracking.                                                                              | praise   |
