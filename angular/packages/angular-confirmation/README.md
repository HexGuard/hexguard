# @hexguard/angular-confirmation

**Headless confirmation dialog state for Angular.** Promise-based `ask()`/`run()` flows for destructive or high-impact actions — no RxJS required.

**[Deep package notes](docs/packages/angular-confirmation.md)** · **[Demo](/packages/angular-confirmation/demo)**

---

## Problem

Every app needs "Are you sure?" dialogs for delete, archive, and destructive actions. Teams rebuild the same promise-based state management: `isOpen` signal, `currentRequest` tracking, resolve/reject wiring, and duplicate-open prevention.

**`@hexguard/angular-confirmation`** standardizes this into one injectable contract with `ask()` (boolean promise), `run()` (async action wrapper), and reactive signals for dialog rendering.

## Installation

```bash
pnpm add @hexguard/angular-confirmation
```

## Quickstart

```typescript
import { injectConfirmation } from '@hexguard/angular-confirmation';

const confirm = injectConfirmation();

const ok = await confirm.ask({
  title: 'Delete order?',
  message: 'This action cannot be undone.',
  confirmLabel: 'Delete',
  destructive: true,
});
if (ok) deleteOrder();
```

## Use Cases

### Simple confirm dialog

```html
@if (confirm.isOpen()) {
<dialog open>
  <p>{{ confirm.currentRequest()?.message }}</p>
  <button (click)="confirm.confirm()">{{ confirm.currentRequest()?.confirmLabel ?? 'OK' }}</button>
  <button (click)="confirm.cancel()">
    {{ confirm.currentRequest()?.cancelLabel ?? 'Cancel' }}
  </button>
</dialog>
}
```

### Async action with confirmation

```typescript
const result = await confirm.run(
  { title: 'Archive', message: `Archive ${count} items?` },
  () => api.archiveItems(selectedIds),
);
if (result.confirmed && result.result) {
  this.items.update(...); // result.result has the API response
}
```

## API

### `injectConfirmation()`

| Member                 | Type                                    | Description                                                 |
| ---------------------- | --------------------------------------- | ----------------------------------------------------------- |
| `isOpen`               | `Signal<boolean>`                       | Whether a dialog is currently shown                         |
| `currentRequest`       | `Signal<ConfirmationRequest \| null>`   | Active request for rendering                                |
| `ask(request)`         | `(r) => Promise<boolean>`               | Opens dialog, resolves `true` on confirm, `false` on cancel |
| `run(request, action)` | `(r, a) => Promise<ConfirmationResult>` | Combines `ask()` with async action execution                |
| `confirm()`            | `() => void`                            | Resolve current dialog as confirmed                         |
| `cancel()`             | `() => void`                            | Resolve current dialog as cancelled                         |

### `ConfirmationRequest`

| Field           | Type      | Description                  |
| --------------- | --------- | ---------------------------- |
| `title`         | `string`  | Dialog title                 |
| `message`       | `string`  | Dialog body text             |
| `confirmLabel?` | `string`  | Confirm button text          |
| `cancelLabel?`  | `string`  | Cancel button text           |
| `destructive?`  | `boolean` | Hint for destructive styling |

## Scope Boundaries

| Concern                                            | Status                           |
| -------------------------------------------------- | -------------------------------- |
| Promise-based confirm/cancel with reactive signals | ✅                               |
| Duplicate-open prevention                          | ✅                               |
| Async action wrapper (`run()`)                     | ✅                               |
| Dialog/modal UI components                         | ❌ (headless — compose your own) |

## Demo

Visit `/packages/angular-confirmation/demo` for delete and archive confirmation flows.
