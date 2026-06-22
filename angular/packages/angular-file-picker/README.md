# @hexguard/angular-file-picker

Headless file picker for Angular: programmatic file selection, drag-and-drop, type/size validation, and signal-based file reading.

## Installation

```bash
pnpm add @hexguard/angular-file-picker
```

## Quickstart

```ts
const picker = injectFilePicker({ accept: 'image/*', multiple: true });

// Open file dialog
picker.open();

// Template: display results
// @for (f of picker.files(); track f.name) {
//   <img [src]="f.content" />
// }
```

### Drag-and-drop zone

```html
<div
  (dragover)="$event.preventDefault()"
  (drop)="picker.acceptDrop($event)"
>
  Drop files here
</div>
```
