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

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `accept` | `string \| string[]` | — | Accepted MIME types or extensions (`'image/*'`, `['.pdf', '.docx']`) |
| `maxFileSize` | `number` | `10_485_760` (10 MB) | Max file size in bytes |
| `multiple` | `boolean` | `false` | Allow multiple file selection |
| `readMode` | `'text' \| 'dataUrl' \| 'buffer' \| 'none'` | `'text'` | How to read file contents |

### `FilePickerHandle<T>`

| Property | Type | Description |
|----------|------|-------------|
| `files` | `Signal<readonly FileHandle<T>[]>` | Selected files with content |
| `loading` | `Signal<boolean>` | True while reading files |
| `error` | `Signal<string \| null>` | Validation or read error |
| `open()` | `() => void` | Open native file picker |
| `clear()` | `() => void` | Clear all files |
| `acceptDrop(event)` | `(event: DragEvent) => void` | Process drag-and-drop files |

### `FileHandle<T>`

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | File name |
| `size` | `number` | File size in bytes |
| `type` | `string` | MIME type |
| `content` | `T` | File content (string, ArrayBuffer, or null) |

---

## Scope Boundaries

| Concern | Status |
|---------|--------|
| File selection dialog | ✅ |
| Drag-and-drop zone | ✅ |
| File type validation | ✅ |
| File size validation | ✅ |
| Content reading (text, data URL, buffer) | ✅ |
| Upload to server | ❌ (handle externally) |
| Progress tracking | ❌ |

## Demo

Visit `/packages/angular-file-picker/demo` in the demo app to see a live file picker with dialog and drag-drop zones.
