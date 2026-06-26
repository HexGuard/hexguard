---
id: feature-angular-file-reader
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-file-reader'
---

# @hexguard/angular-file-reader

## Summary

FileReader state for Angular — read files as text, Data URL, ArrayBuffer, or Blob with progress tracking and cancellation. Complements `@hexguard/angular-file-picker` (selection/validation) with reading/parsing.

**Competition check:** No headless Angular FileReader state package exists.

## Goals

1. Provide `injectFileReader()` — read files with signal-based progress and result.
2. Support all read modes: text, DataURL, ArrayBuffer, binary string.
3. Expose signals: `reading`, `progress` (0–1), `result`, `error`, `completed`.
4. Support cancellation via `AbortController`.
5. Support reading multiple files sequentially or in parallel.

## Proposed Public API

```typescript
export interface FileReaderConfig {
  mode?: 'text' | 'dataUrl' | 'arrayBuffer' | 'binaryString';
  encoding?: string;
}

export interface FileReaderState {
  readonly reading: Signal<boolean>;
  readonly progress: Signal<number>;
  readonly result: Signal<string | ArrayBuffer | null>;
  readonly error: Signal<string | null>;
  readonly completed: Signal<boolean>;

  read(file: File | Blob): Promise<string | ArrayBuffer>;
  readAll(files: File[] | Blob[], parallel?: boolean): Promise<(string | ArrayBuffer)[]>;
  cancel(): void;
  reset(): void;
}

export function injectFileReader(config?: FileReaderConfig): FileReaderState;
```

## Implementation Plan

1. Scaffold `angular/packages/angular-file-reader/`.
2. Implement `injectFileReader()` wrapping `FileReader` API with signals.
3. Implement reading queue for sequential/parallel modes.
4. Add tests with mock Blob.
5. Register in workspace.
