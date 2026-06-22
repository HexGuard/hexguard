# @hexguard/angular-file-picker

**Headless file picker for Angular.** Programmatic file selection, drag-and-drop, type/size validation, and signal-based file reading — no RxJS required.

**[Deep package notes](docs/packages/angular-file-picker.md)** · **[Demo](/packages/angular-file-picker/demo)**

---

## Problem

File upload forms need file selection, validation (type, size), content reading (text, base64), and drag-and-drop support — every screen rebuilds the same `<input type="file">` boilerplate with manual validation and DOM management.

**`@hexguard/angular-file-picker`** provides a headless injectable factory with signal-based state, configurable validation, and multiple read modes — all with automatic `DestroyRef` cleanup.

## Installation

```bash
pnpm add @hexguard/angular-file-picker
```

## Quickstart

```typescript
const picker = injectFilePicker({ accept: 'image/*', multiple: true });

// Open file dialog
picker.open();

// In template:
@for (f of picker.files(); track f.name) {
  <img [src]="f.content" />
}
```

### Drag-and-drop zone

```html
<div (dragover)="$event.preventDefault()" (drop)="picker.acceptDrop($event)">Drop files here</div>
```

## Use Cases

### Image upload with preview

```typescript
const picker = injectFilePicker({ accept: 'image/*', readMode: 'dataUrl' });

// In template:
@for (f of picker.files(); track f.name) {
  <div>
    <img [src]="f.content" class="preview" />
    <span>{{ f.name }} ({{ (f.size / 1024).toFixed(1) }} KB)</span>
  </div>
}
```

### CSV/text file reader

```typescript
const picker = injectFilePicker({ accept: '.csv,.tsv,.txt', readMode: 'text' });
picker.open();
// picker.files()[0].content contains the full text
```

### Metadata-only (for upload queue)

```typescript
const picker = injectFilePicker({ readMode: 'none' });
picker.open();
// picker.files() returns { name, size, type } without reading contents
```

## API

### `injectFilePicker(options?)`

| Option        | Type                                        | Default              | Description                                                |
| ------------- | ------------------------------------------- | -------------------- | ---------------------------------------------------------- |
| `accept`      | `string \| string[]`                        | —                    | MIME types or extensions: `'image/*'`, `['.pdf', '.docx']` |
| `maxFileSize` | `number`                                    | `10_485_760` (10 MB) | Max file size in bytes                                     |
| `multiple`    | `boolean`                                   | `false`              | Allow multiple file selection                              |
| `readMode`    | `'text' \| 'dataUrl' \| 'buffer' \| 'none'` | `'text'`             | How to read file contents                                  |

### `FilePickerHandle<T>`

| Member              | Type                               | Description                    |
| ------------------- | ---------------------------------- | ------------------------------ |
| `files`             | `Signal<readonly FileHandle<T>[]>` | Selected files with content    |
| `loading`           | `Signal<boolean>`                  | True while reading files       |
| `error`             | `Signal<string \| null>`           | Validation or read error       |
| `open()`            | `() => void`                       | Open native file picker dialog |
| `clear()`           | `() => void`                       | Clear all files and errors     |
| `acceptDrop(event)` | `(e: DragEvent) => void`           | Process drag-and-drop files    |

### `FileHandle<T>`

| Field     | Type     | Description                                                         |
| --------- | -------- | ------------------------------------------------------------------- |
| `name`    | `string` | File name                                                           |
| `size`    | `number` | File size in bytes                                                  |
| `type`    | `string` | MIME type                                                           |
| `content` | `T`      | File content (`string`, `ArrayBuffer`, or `null` for metadata-only) |

## Important Notes

- Client-side validation is a **convenience, not a security boundary** — always validate on the server
- `localStorage` has a ~5 MB quota — for large files, use `readMode: 'none'` and upload directly

## Scope Boundaries

| Concern                                 | Status                 |
| --------------------------------------- | ---------------------- |
| File selection dialog                   | ✅                     |
| Drag-and-drop zone                      | ✅                     |
| File type/size validation               | ✅                     |
| Content reading (text, dataUrl, buffer) | ✅                     |
| Upload to server                        | ❌ (handle externally) |
| Upload progress tracking                | ❌                     |

## Demo

Visit `/packages/angular-file-picker/demo` for a live file picker with dialog and drag-drop zones.
