# @hexguard/angular-form-drafts

**Form draft management for Angular.** localStorage-backed auto-save, restore, TTL expiry, and signal-based draft status — no RxJS required.

**[Deep package notes](docs/packages/angular-form-drafts.md)** · **[Demo](/packages/angular-form-drafts/demo)**

---

## Problem

Users lose work when they accidentally navigate away, close a tab, or their session expires. Multi-step forms, article editors, and long input screens need auto-saving drafts to localStorage with debounced writes, configurable expiry, and clear restore controls.

**`@hexguard/angular-form-drafts`** provides an injectable factory for debounced localStorage persistence with TTL expiry, signal-based draft status, and a clean restore/clear API.

## Installation

```bash
pnpm add @hexguard/angular-form-drafts
```

## Quickstart

```typescript
import { injectFormDraft } from '@hexguard/angular-form-drafts';

const draft = injectFormDraft<{ title: string; body: string }>('new-post', {
  debounceMs: 500,
  ttlMs: 86_400_000, // 24 hours
});

// Auto-save on changes (debounced)
draft.save({ title: form.value.title, body: form.value.body });

// Restore on page load
const saved = draft.restore();
if (saved) form.patchValue(saved.data);

// Template
@if (draft.hasDraft()) {
  <p>You have a saved draft from {{ draft.metadata()?.savedAt | date }}</p>
}
```

## Use Cases

### Article editor with auto-save
```typescript
@Component({...})
class PostEditorComponent {
  readonly draft = injectFormDraft<PostData>('editor-post', { debounceMs: 1000 });

  ngOnInit() {
    const saved = this.draft.restore();
    if (saved) this.form.patchValue(saved.data);
  }

  onFormChange() {
    this.draft.save(this.form.value);
  }

  onPublish() {
    this.draft.clear(); // Remove draft on successful publish
  }
}
```

### Multi-step wizard
```typescript
// Auto-save each step
step1Form.valueChanges.subscribe(() => draft.save({ step: 1, ...step1Form.value }));
step2Form.valueChanges.subscribe(() => draft.save({ step: 2, ...step2Form.value }));
```

## API

### `injectFormDraft<T>(key, options?)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `key` | `string` | required | Unique draft key (stored as `hexguard:draft:{key}`) |
| `debounceMs` | `number` | `500` | Auto-save debounce window |
| `ttlMs` | `number` | `86_400_000` (24h) | Draft TTL (expired drafts return `null` on restore) |
| `storage` | `Storage` | `localStorage` | Custom storage backend |
| `serialize` / `deserialize` | `(v) => string` | `JSON.stringify/parse` | Custom serde |

### `FormDraftHandle<T>`

| Member | Type | Description |
|--------|------|-------------|
| `hasDraft` | `Signal<boolean>` | Whether a valid (non-expired) draft exists |
| `metadata` | `Signal<DraftMetadata \| null>` | Save timestamp and expiry |
| `save(data)` | `(d: T) => void` | Save form data (debounced) |
| `restore()` | `() => FormDraft<T> \| null` | Read saved draft (null if expired/missing) |
| `clear()` | `() => void` | Delete draft and cancel pending save |

### `FormDraft<T>`

| Field | Type | Description |
|-------|------|-------------|
| `data` | `T` | The saved form data |
| `meta.savedAt` | `string` | ISO timestamp of last save |
| `meta.expiresAt` | `string` | ISO timestamp of expiry |

## Important Notes

- `localStorage` quota is ~5 MB per origin — suitable for text drafts, not large binary files
- Multiple tabs writing to the same draft key use last-write-wins semantics
- Server-side validation is still required when submitting restored drafts

## Scope Boundaries

| Concern | Status |
|---------|--------|
| Debounced auto-save to localStorage | ✅ |
| Configurable TTL with auto-expiry | ✅ |
| Signal-based draft status and metadata | ✅ |
| Restore and clear API | ✅ |
| Custom storage backend | ✅ |
| Offline sync or conflict resolution | ❌ |

## Demo

Visit `/packages/angular-form-drafts/demo` for a live form with auto-save, restore, and clear controls.

