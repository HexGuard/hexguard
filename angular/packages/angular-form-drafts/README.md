# @hexguard/angular-form-drafts

Form draft management for Angular: localStorage-backed auto-save, restore, expiry, and signal-based draft status.

## Installation

```bash
pnpm add @hexguard/angular-form-drafts
```

## Quickstart

```ts
const draft = injectFormDraft<{ title: string; body: string }>('new-post', {
  debounceMs: 500,  // auto-save debounce
  ttlMs: 86_400_000, // 24h expiry
});

// Save form data (debounced)
draft.save({ title: form.value.title, body: form.value.body });

// Restore on page load
const saved = draft.restore();
if (saved) form.patchValue(saved.data);

// Template
// @if (draft.hasDraft()) { You have a saved draft }
```
