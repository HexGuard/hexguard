# @hexguard/angular-file-picker

**Headless file picker for Angular.** Provides `injectFilePicker()` — a signal-based factory for programmatic file selection, drag-and-drop, type/size validation, and configurable content reading.

---

## Installation

```bash
pnpm add @hexguard/angular-file-picker
```

## Quick Start

```typescript
import { injectFilePicker } from '@hexguard/angular-file-picker';

@Component({ ... })
class UploadComponent {
  readonly picker = injectFilePicker({ accept: 'image/*', multiple: true });

  // Open the native file dialog
  picker.open();

  // Template:
  // @for (f of picker.files(); track f.name) {
  //   <img [src]="f.content" />
  // }
}
```

## API

### `injectFilePicker<T>(options?: FilePickerOptions): FilePickerHandle<T>`

Creates a headless file picker. Must be called in an injection context.

### `FilePickerOptions`

| Option        | Type                                        | Default              | Description                                                          |
| ------------- | ------------------------------------------- | -------------------- | -------------------------------------------------------------------- |
| `accept`      | `string \| string[]`                        | —                    | Accepted MIME types or extensions (`'image/*'`, `['.pdf', '.docx']`) |
| `maxFileSize` | `number`                                    | `10_485_760` (10 MB) | Max file size in bytes                                               |
| `multiple`    | `boolean`                                   | `false`              | Allow multiple file selection                                        |
| `readMode`    | `'text' \| 'dataUrl' \| 'buffer' \| 'none'` | `'text'`             | How to read file contents                                            |

### `FilePickerHandle<T>`

| Property            | Type                               | Description                 |
| ------------------- | ---------------------------------- | --------------------------- |
| `files`             | `Signal<readonly FileHandle<T>[]>` | Selected files with content |
| `loading`           | `Signal<boolean>`                  | True while reading files    |
| `error`             | `Signal<string \| null>`           | Validation or read error    |
| `open()`            | `() => void`                       | Open native file picker     |
| `clear()`           | `() => void`                       | Clear all files             |
| `acceptDrop(event)` | `(event: DragEvent) => void`       | Process drag-and-drop files |

### `FileHandle<T>`

| Property  | Type     | Description                                 |
| --------- | -------- | ------------------------------------------- |
| `name`    | `string` | File name                                   |
| `size`    | `number` | File size in bytes                          |
| `type`    | `string` | MIME type                                   |
| `content` | `T`      | File content (string, ArrayBuffer, or null) |

---

## Scope Boundaries

| Concern                                  | Status                 |
| ---------------------------------------- | ---------------------- |
| File selection dialog                    | ✅                     |
| Drag-and-drop zone                       | ✅                     |
| File type validation                     | ✅                     |
| File size validation                     | ✅                     |
| Content reading (text, data URL, buffer) | ✅                     |
| Upload to server                         | ❌ (handle externally) |
| Progress tracking                        | ❌                     |

## Demo

Visit `/packages/angular-file-picker/demo` in the demo app to see a live file picker with dialog and drag-drop zones.

---

## Assessment: Potential Improvements

| Area       | Suggestion                                                                                                                                             | Priority |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| API        | The `accept` option only validates client-side — document that server-side validation is still required                                                | Low      |
| API        | Consider adding `acceptDrop` overload that accepts a `FileList` directly (useful when wrapping other drag-drop libraries)                              | Low      |
| API        | Consider a `clearError()` method for scenarios where the error should be dismissed without clearing files                                              | Low      |
| API        | The demo has a "Read mode" select that doesn't actually change the picker's read mode — the picker is created with a fixed mode at construction time   | Medium   |
| Validation | `accept` filter wildcard `image/*` works but `image/*,video/*` type patterns should be explicitly tested                                               | Low      |
| Edge Cases | No test for the `change` event path (picking files via the native dialog) — only `acceptDrop` is tested                                                | Medium   |
| Memory     | `createInput()` appends a hidden `<input>` to `document.body` — consider reusing the same element across calls instead of creating a new one each time | Low      |

## Related Resources

- [Package README](../../angular/packages/angular-file-picker/README.md)
- [Package Catalog](../README.md)
- [Demo Routes](../../angular/apps/demo-angular/src/app/features/packages/angular/angular-file-picker/)
- [Source Code](../../angular/packages/angular-file-picker/src/)

---

## API Review Findings

Review date: 2026-06-22. Findings are observational.

### Observations

| Dimension              | Finding                                                                                                                                                               | Severity |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Public API Design      | Clean surface: 1 function (`injectFilePicker`), `DEFAULT_MAX_FILE_SIZE`, 4 types.                                                                                     | praise   |
| Implementation Quality | Feature-rich: file dialog, drag-and-drop, type/size validation, 4 read modes (text, dataUrl, buffer, none).                                                           | praise   |
| Implementation Quality | `createInput()` appends new `<input>` to `document.body` each `open()` call — never reused. `DestroyRef` cleanup removes it but rapid open/close creates/removes DOM. | minor    |
| Test Coverage          | Validation (type, size), multiple files, read modes (text, dataUrl, none), loading state.                                                                             | praise   |
| Test Coverage          | No test for `change` event path (native dialog) — only `acceptDrop` is tested. No test for `buffer` read mode.                                                        | moderate |
| Demo Integration       | Interactive demo with file pick/open/clear, drag-and-drop zone, file preview, inspector panel.                                                                        | praise   |
