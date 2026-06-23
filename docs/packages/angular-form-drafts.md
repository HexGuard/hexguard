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

| Option        | Type                    | Default            | Description              |
| ------------- | ----------------------- | ------------------ | ------------------------ |
| `debounceMs`  | `number`                | `500`              | Auto-save debounce in ms |
| `ttlMs`       | `number`                | `86_400_000` (24h) | Draft TTL in ms          |
| `storage`     | `Storage`               | `localStorage`     | Custom storage backend   |
| `serialize`   | `(value) => string`     | `JSON.stringify`   | Custom serializer        |
| `deserialize` | `(raw) => FormDraft<T>` | `JSON.parse`       | Custom deserializer      |

### `FormDraftHandle<T>`

| Property     | Type                            | Description                                |
| ------------ | ------------------------------- | ------------------------------------------ |
| `hasDraft`   | `Signal<boolean>`               | Whether a valid draft exists               |
| `metadata`   | `Signal<DraftMetadata \| null>` | Draft save/expiry timestamps               |
| `restore()`  | `() => FormDraft<T> \| null`    | Read saved draft (null if expired/missing) |
| `save(data)` | `(data: T) => void`             | Save form data (debounced)                 |
| `clear()`    | `() => void`                    | Delete draft, cancel pending save          |

## Demo

Visit `/packages/angular-form-drafts/demo` in the demo app to see a live form with auto-save, restore, and clear controls.

---

## Assessment: Potential Improvements

| Area        | Suggestion                                                                                                                                                                                                | Priority    |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| API         | Consider adding a `lastSavedAt` signal for showing "Saved X minutes ago" in the UI                                                                                                                        | Low         |
| API         | Consider a `draftCount` static method to enumerate all draft keys (useful for a "Manage drafts" page)                                                                                                     | Medium      |
| API         | Consider an `autoSave` option (on/off) to let users disable auto-save                                                                                                                                     | Low         |
| Expiry      | Currently, `hasDraft` is only updated on init, save, clear, and `restore()`. An expired draft's `hasDraft` stays true until `restore()` is called — fixed by making `restore()` sync the signals          | Fixed       |
| Concurrency | No handling for multiple tabs writing to the same draft key — last-write-wins                                                                                                                             | Low         |
| Size Limit  | Consider a `maxDraftSize` option or warning for large drafts (localStorage quota is ~5MB)                                                                                                                 | Low         |
| API         | ✅ Added RxJS observable alternative — `watchFormDraft()` returns `{ draft$, hasDraft$, metadata$, save(), clear() }` with `debounceTime`-based persistence. Import from `@hexguard/angular-form-drafts`. | Implemented |

## Code Examples

### Clear draft after successful API submission

```typescript
import { injectFormDraft } from '@hexguard/angular-form-drafts';

@Component({ ... })
class ArticleEditorComponent {
  readonly draft = injectFormDraft<Article>('article-new');

  async onSubmit(): Promise<void> {
    const saved = this.draft.restore();
    if (!saved) return;

    try {
      await this.api.save(saved.data);
      this.draft.clear(); // Remove draft on success
      this.notify.success('Saved!');
    } catch {
      // Keep draft intact on failure — user can retry
      this.notify.error('Save failed, your draft is preserved');
    }
  }
}
```

### Custom serializer for complex data

```typescript
const draft = injectFormDraft<FormData>('complex-form', {
  serialize: (data) => JSON.stringify(data, ['title', 'body', 'tags']),
  deserialize: (raw) => {
    const parsed = JSON.parse(raw);
    return { data: parsed, savedAt: parsed.savedAt, expiresAt: parsed.expiresAt };
  },
});
```

### Use sessionStorage instead of localStorage

```typescript
const draft = injectFormDraft('session-data', {
  storage: sessionStorage,
  debounceMs: 1000,
});
```

### RxJS observable — `watchFormDraft()`

For RxJS consumers, `watchFormDraft()` provides observable-based draft management with `debounceTime` persistence:

```ts
import { watchFormDraft } from '@hexguard/angular-form-drafts';
import { filter } from 'rxjs/operators';

const draft = watchFormDraft<{ title: string; body: string }>('new-post');

// React to draft state changes
draft.hasDraft$.subscribe((has) => showDraftIndicator(has));
draft.draft$.pipe(filter(Boolean)).subscribe((d) => preview(d.data));

// Debounced auto-save
draft.save({ title: 'Hello', body: 'World' });
// Persists to localStorage after default 500ms debounce

// Clear when done
draft.clear();
```

## Related Resources

- [Package README](../../angular/packages/angular-form-drafts/README.md)
- [Package Catalog](../README.md)
- [Demo Routes](../../angular/apps/demo-angular/src/app/features/packages/angular/angular-form-drafts/)
- [Source Code](../../angular/packages/angular-form-drafts/src/)

---

## API Review Findings

Review date: 2026-06-22. Findings are observational — no code has been changed.

### Observations

| Dimension                 | Finding                                                                                                                                                                                                              | Severity |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Public API Design         | Narrow surface — exactly 5 exports (1 function, 3 types, 2 constants). No internal helpers leaked.                                                                                                                   | praise   |
| Public API Design         | `injectFormDraft<T>(key, options?)` follows the standard `inject*()` naming convention used across sibling packages.                                                                                                 | praise   |
| Public API Design         | JSDoc on all exports — `injectFormDraft()` has full `@example` with TypeScript and template snippets, meeting the workflow standard.                                                                                 | praise   |
| Public API Design         | `DEFAULT_DEBOUNCE_MS` and `DEFAULT_TTL_MS` are exported constants without JSDoc — though their names are self-explanatory.                                                                                           | minor    |
| Implementation Quality    | Signal-first: uses `signal()` and `.asReadonly()` for `hasDraft` and `metadata`. No RxJS.                                                                                                                            | praise   |
| Implementation Quality    | Lifecycle-safe: `DestroyRef.onDestroy()` clears debounce timeout. `clear()` also cancels pending timeouts.                                                                                                           | praise   |
| Implementation Quality    | SSR-safe: `typeof localStorage !== 'undefined'` guard handles non-browser environments.                                                                                                                              | praise   |
| Implementation Quality    | `persistDraft()` lacks `try/catch` around `storage.setItem()` — a `QuotaExceededError` (localStorage ~5MB limit) would throw unhandled.                                                                              | moderate |
| Implementation Quality    | `serialize()`/`deserialize()` (defaults `JSON.stringify`/`JSON.parse`) not wrapped in `try/catch` — could throw on circular references or malformed data.                                                            | minor    |
| Documentation             | README covers problem statement, quickstart, use cases, full API tables, important notes, scope boundaries. Comprehensive for a utility package.                                                                     | praise   |
| Documentation             | Deep-dive doc includes a thorough "Assessment: Potential Improvements" section with prioritized suggestions. Only 5 packages in the catalog have this section.                                                       | praise   |
| Test Coverage             | 8 tests covering: init with no draft, save/restore, `clear()`, expired draft detection, metadata updates, non-existent key, missing storage, clear-cancels-pending-save.                                             | praise   |
| Test Coverage             | Missing tests: custom `serialize`/`deserialize`, custom `ttlMs`, `save()` with null/undefined data, rapid successive saves within debounce window, storage corruption/malformed JSON, `QuotaExceededError` handling. | moderate |
| Test Coverage             | No Playwright e2e tests exist for form-drafts demo.                                                                                                                                                                  | minor    |
| Demo Integration          | Full interactive demo with form fields, save/restore/clear controls, status badge, metadata display, inspector panel with snapshot JSON and code sample tabs.                                                        | praise   |
| Demo Integration          | Stable `data-testid` attributes on all interactive elements. Uses `DemoPageLayoutComponent` and shared UI components.                                                                                                | praise   |
| Cross-package Consistency | Does NOT use the `provide*()` + `inject*()` multi-instance pattern — appropriate since drafts are disambiguated by string `key`, not InjectionToken. Uses the simpler single-inject pattern like `injectStorage()`.  | praise   |
| Cross-package Consistency | No release workflow file (`.github/workflows/release-angular-form-drafts.yml`) — per Phase 6 of the new-package-workflow, this blocks automated publishing.                                                          | moderate |
| Cross-package Consistency | `test:lib:form-drafts` script is referenced in the `test:lib` chain in `angular/package.json` but has no standalone definition — running `pnpm test:lib:form-drafts` directly would fail.                            | moderate |
| Cross-package Consistency | Package appears twice in `scripts/package-catalog.data.mjs`: once as `"Released"` in `currentPackages`, and once as `"Proposed"` in `proposedPackages`.                                                              | minor    |

### Improvement & Extension Opportunities

| Area       | Suggestion                                                                                                                         | Type        | Difficulty |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------- |
| Robustness | Wrap `storage.setItem()` in `persistDraft()` with `try/catch` to handle `QuotaExceededError` gracefully.                           | improvement | easy       |
| Robustness | Wrap `serialize()`/`deserialize()` calls in `try/catch` to handle `JSON.stringify`/`JSON.parse` failures on circular/invalid data. | improvement | easy       |
| Tests      | Add tests for custom `serialize`/`deserialize` functions.                                                                          | improvement | easy       |
| Tests      | Add tests for custom `ttlMs` option.                                                                                               | improvement | easy       |
| Tests      | Add rapid successive save test (multiple calls within debounce window).                                                            | improvement | easy       |
| Tests      | Add malformed JSON / storage corruption test.                                                                                      | improvement | easy       |
| Infra      | Create a release workflow `.github/workflows/release-angular-form-drafts.yml` following the pattern from other packages.           | improvement | medium     |
| Infra      | Add standalone `test:lib:form-drafts` script to `angular/package.json`.                                                            | improvement | easy       |
| Infra      | Remove duplicate `"Proposed"` entry from `scripts/package-catalog.data.mjs`.                                                       | improvement | easy       |
| Extension  | Add `lastSavedAt` signal for "Saved X minutes ago" UI display.                                                                     | extension   | easy       |
| Extension  | Add `draftCount()` static method to enumerate all draft keys for a "Manage drafts" page.                                           | extension   | medium     |
| Extension  | Add `autoSave` toggle option to let users disable auto-save dynamically.                                                           | extension   | easy       |
| Extension  | Add `maxDraftSize` warning for large drafts approaching ~5MB localStorage quota.                                                   | extension   | easy       |
