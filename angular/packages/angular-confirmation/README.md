# @hexguard/angular-confirmation
Headless confirmation dialog state for Angular: promise-based `ask()`/`run()` flows for destructive or high-impact actions.

## Installation
```bash
pnpm add @hexguard/angular-confirmation
```

## Quickstart
```ts
const confirm = injectConfirmation();

const ok = await confirm.ask({
  title: 'Delete order?',
  message: 'This action cannot be undone.',
  confirmLabel: 'Delete',
  destructive: true,
});
if (ok) { deleteOrder(); }
```

## API
- `ask(request)` — Returns `Promise<boolean>`
- `run(request, action)` — Returns `{ confirmed: true, result } | { confirmed: false }`
- `isOpen: Signal<boolean>` — Whether a dialog is currently shown
- `currentRequest: Signal<ConfirmationRequest | null>`
