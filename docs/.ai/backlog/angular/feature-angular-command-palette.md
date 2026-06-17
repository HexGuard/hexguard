---
id: feature-angular-command-palette
type: feature
status: proposed
created: 2026-06-13
package: '@hexguard/angular-command-palette'
---

# Angular Command Palette Package

## Summary

Design `@hexguard/angular-command-palette` as a package for standardizing command registration,
keyboard shortcuts, and searchable action invocation across Angular apps.

The repeated problem is that productivity-focused apps keep rebuilding ad hoc shortcut registries,
palette overlays, and context-aware command systems with inconsistent accessibility and routing
behavior.

## Goals

- Standardize command registration and invocation for Angular apps.
- Support searchable command palettes, keyboard shortcuts, and context-aware command enablement.
- Keep the first version usable with or without a visible command-palette UI.
- Compose with permissions, feature flags, and page context.

## Non-Goals

- Replacing a full overlay or design system.
- Owning every global keyboard interaction.
- Modeling complex macro or workflow automation in v0.1.

## Decisions

- Prefer a headless command registry first.
- Keep visible palette UI optional.
- Treat shortcuts and palette entries as views over the same command contract.

## Proposed Public API

```ts
import { injectCommandRegistry, type Command } from '@hexguard/angular-command-palette';

const registry = injectCommandRegistry();

// Register commands
registry.register({
  id: 'order.create',
  title: 'Create Order',
  shortcut: 'Ctrl+Shift+N',
  category: 'Orders',
  icon: 'plus',
  enabled: signal(true),
  invoke: () => router.navigate(['/orders/create']),
});

// Search
registry.search('create'); // Signal<Command[]>

// Invoke by shortcut
registry.handleShortcut(event); // matches against registered shortcuts

// Palette state
registry.paletteOpen; // Signal<boolean>
registry.togglePalette();
registry.openPalette();
registry.closePalette();
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold `angular/packages/angular-command-palette/`.
2. Add build/test scripts.

### Phase 1: Core Implementation

3. Define `Command` type with id, title, shortcut, category, enabled signal, invoke callback.
4. Implement `injectCommandRegistry()` with command map, register/search/invoke methods.
5. Implement shortcut handling — listen for `keydown`, match against registered shortcuts, detect conflicts.
6. Implement `search()` — filters commands by title/category with simple string matching.
7. Implement palette open/close state.
8. Add unit tests for: registration, search, shortcut match, shortcut conflict, invoke, palette toggle, cleanup.

### Phase 2: Demo & Docs

9. Add demo route with command palette overlay, shortcut list, search bar.
10. Add Playwright coverage.
11. Write docs.

### Phase 3: Release

12. Add verify script, release workflow.
13. Run validation gate.

## Validation

- `pnpm test:lib:command-palette`.
- `pnpm test:e2e`.

## Validation

- Unit tests for registration, invocation, and shortcut conflict handling.
- Demo coverage for palette search and keyboard shortcuts.
- Manual accessibility checks if palette UI helpers are included.

## Follow-Ups

- Decide whether visible palette UI belongs in the same package or a companion package.
- Revisit overlap with page-context action systems after both proposals mature.
