# @hexguard/angular-command-palette

**Headless command registry for Angular.** Register, search, and invoke commands with keyboard shortcuts, context-aware enablement, and palette open/close state — no UI library required.

**[Deep package notes](docs/packages/angular-command-palette.md)** · **[Demo](/packages/angular-command-palette/demo)**

---

## Problem

Productivity-focused apps keep rebuilding ad hoc shortcut registries, palette overlays, and context-aware command systems with inconsistent behavior. Teams need a standard way to register commands and match keyboard shortcuts without coupling to a specific UI library.

**`@hexguard/angular-command-palette`** provides a headless command registry with shortcut indexing, text search, and palette state management. Palette UI components are deferred to a future version.

## Installation

```bash
pnpm add @hexguard/angular-command-palette
```

## Quickstart

```typescript
import { injectCommandRegistry } from '@hexguard/angular-command-palette';

const registry = injectCommandRegistry();

registry.register({
  id: 'order.create',
  title: 'Create Order',
  shortcut: 'Ctrl+Shift+N',
  category: 'Orders',
  invoke: () => console.log('Create Order'),
});
// Ctrl+Shift+N now invokes the command globally.
```

## Use Cases

### Searchable command palette

```typescript
@Component({
  template: `<input #search (input)="query = search.value" />`,
})
class PaletteComponent {
  private readonly registry = injectCommandRegistry();
  query = '';

  get commands() {
    return this.registry.search(this.query);
  }
}
// Typing "order" filters to matching commands by title and category.
```

### Context-aware enablement

```typescript
const canCreate = signal(false);

registry.register({
  id: 'order.create',
  title: 'Create Order',
  shortcut: 'Ctrl+Shift+N',
  enabled: canCreate.asReadonly(),
  invoke: () => router.navigate(['/orders/create']),
});
// Shortcut is ignored when the command is disabled.
// Command is still searchable and invokable from palette.
```

## API

### `injectCommandRegistry(options?)`

| Signal        | Type              | Description                 |
| ------------- | ----------------- | --------------------------- |
| `paletteOpen` | `Signal<boolean>` | Whether the palette is open |

| Method               | Description                            |
| -------------------- | -------------------------------------- |
| `openPalette()`      | Open the palette                       |
| `closePalette()`     | Close the palette                      |
| `togglePalette()`    | Toggle palette open/closed             |
| `register(cmds)`     | Register one or more commands          |
| `unregister(id)`     | Remove a command                       |
| `getCommands()`      | List all registered commands           |
| `search(query)`      | Filter commands by title and category  |
| `handleShortcut(ev)` | Match KeyboardEvent, invoke if matched |

### `Command`

| Field       | Type              | Description                         |
| ----------- | ----------------- | ----------------------------------- |
| `id`        | `string`          | Unique identifier                   |
| `title`     | `string`          | Display title                       |
| `shortcut?` | `string`          | Keyboard shortcut (e.g. `'Ctrl+K'`) |
| `category?` | `string`          | Grouping category                   |
| `icon?`     | `string`          | Icon identifier                     |
| `enabled?`  | `Signal<boolean>` | When false, shortcuts are ignored   |
| `invoke`    | `() => void`      | Called on invocation                |

## Scope Boundaries

| Concern                                        | Status                    |
| ---------------------------------------------- | ------------------------- |
| Command registration with typed model          | ✅                        |
| Keyboard shortcut matching (Ctrl/Meta)         | ✅                        |
| Text search by title and category              | ✅                        |
| Palette open/close state                       | ✅                        |
| Context-aware enablement per command           | ✅                        |
| Global keydown listener with input exclusion   | ✅                        |
| Fuzzy search (e.g. "crt odr" → "Create Order") | ❌ (v0.2)                 |
| Built-in palette overlay UI                    | ❌ (v0.2 — headless only) |

## Demo

Visit `/packages/angular-command-palette/demo` to register sample commands, search them, and test keyboard shortcuts.
