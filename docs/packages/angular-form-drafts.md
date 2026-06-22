# @hexguard/angular-form-drafts

**Form draft management for Angular.** Provides `injectFormDraft()` — a signal-based factory for debounced localStorage persistence with configurable TTL.

---

## Installation

```bash
pnpm add @hexguard/angular-form-drafts
```

## Quick Start

```typescript
import { injectFormDraft } from '@hexguard/angular-form-drafts';

@Component({ ... })
class PostEditorComponent {
  readonly draft = injectFormDraft<{ title: string; body: string }>('new-post', {
    debounceMs: 500,
  });

  // Restore on init
  ngOnInit() {
    const saved = this.draft.restore();
    if (saved) this.form.patchValue(saved.data);
  }

  // Auto-save on changes
  onFormChange() {
    this.draft.save(this.form.value);
  }
}
```

## API

### `injectFormDraft<T>(key: string, options?: FormDraftOptions<T>): FormDraftHandle<T>`

Creates a localStorage-backed form draft handle. Must be called in an injection context. The `key` is used as part of the storage key (`hexguard:draft:{key}`).

### `FormDraftOptions<T>`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `debounceMs` | `number` | `500` | Auto-save debounce in ms |
| `ttlMs` | `number` | `86_400_000` (24h) | Draft TTL in ms |
| `storage` | `Storage` | `localStorage` | Custom storage backend |
| `serialize` | `(value) => string` | `JSON.stringify` | Custom serializer |
| `deserialize` | `(raw) => FormDraft<T>` | `JSON.parse` | Custom deserializer |

### `FormDraftHandle<T>`

| Property | Type | Description |
|----------|------|-------------|
| `hasDraft` | `Signal<boolean>` | Whether a valid draft exists |
| `metadata` | `Signal<DraftMetadata \| null>` | Draft save/expiry timestamps |
| `restore()` | `() => FormDraft<T> \| null` | Read saved draft (null if expired/missing) |
| `save(data)` | `(data: T) => void` | Save form data (debounced) |
| `clear()` | `() => void` | Delete draft, cancel pending save |

## Demo

Visit `/packages/angular-form-drafts/demo` in the demo app to see a live form with auto-save, restore, and clear controls.
