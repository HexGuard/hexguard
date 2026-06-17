---
id: feature-angular-file-picker
type: feature
status: proposed
created: 2026-06-17
package: '@hexguard/angular-file-picker'
---

# Angular File Picker Package

## Summary

Design `@hexguard/angular-file-picker` as a headless Angular package for standardizing file-selection state with type/size validation, preview generation, drag-and-drop zone state, and multi-file queue management — the selection phase before upload.

The repeated problem is that file upload UIs need client-side validation (file type, size, count), preview generation (images, documents), drag-and-drop feedback (dragover/dragleave/drop), and multi-file queue management before the upload even starts. Every team rebuilds this selection layer.

## Goals

- Provide `injectFilePicker(options?)` with signals for selected files, validation errors, drag state, and preview URLs.
- Support file type validation (MIME type whitelist/blacklist).
- Support file size validation (min/max per file and total).
- Support multi-file selection with configurable max count.
- Support drag-and-drop zone state signals (`isDragOver`).
- Support auto-generated preview URLs for images (via `URL.createObjectURL`).
- Expose `clear()`, `removeFile(index)`, and `selectFiles(files)` control methods.

## Non-Goals

- Upload progress, cancellation, or HTTP transfer — that's `angular-upload-state`.
- Crop, rotate, or image editing — previews are read-only.
- File picker UI components (file drop zone, file list) — app owns rendering.

## Proposed Public API

```ts
const picker = injectFilePicker({
  accept: ['image/*', 'application/pdf'],
  maxFileSizeMb: 10,
  maxTotalSizeMb: 50,
  maxFiles: 5,
});

// Signals
picker.files;              // Signal<SelectedFile[]>
picker.isDragOver;         // Signal<boolean>
picker.hasFiles;           // Signal<boolean>
picker.validationErrors;   // Signal<FileValidationError[]>
picker.totalSizeBytes;     // Signal<number>
picker.isValid;            // Signal<boolean>

// Control
picker.selectFiles(fileList: FileList | File[]): void;
picker.removeFile(index: number): void;
picker.clear(): void;
picker.previewUrl(index: number): Signal<string | null>; // objectURL for images
```

## Implementation Plan

1. Scaffold `angular/packages/angular-file-picker/`.
2. Implement `injectFilePicker()` with validation, drag state, preview URL management.
3. Implement `URL.revokeObjectURL` cleanup on destroy.
4. Add unit tests for: validation rules, drag events, multi-file, preview, error messages.
5. Add demo route, docs, release.
