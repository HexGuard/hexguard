---
id: feature-angular-import
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-import'
---

# @hexguard/angular-import

## Summary

Data import wizard state — file selection → column mapping → validation → preview → execution. Every admin panel with CSV/Excel import rebuilds this flow.

## Proposed Public API

```typescript
export interface ImportConfig<T> {
  acceptedFormats?: ('csv' | 'xlsx' | 'json')[];
  columnMap?: Record<string, keyof T>;
  validate?: (row: Partial<T>) => string[];
  onImport: (rows: T[]) => Promise<ImportResult[]>;
  maxRows?: number;
}

export function injectImport<T extends Record<string, unknown>>(config: ImportConfig<T>): {
  readonly phase: Signal<'select' | 'map' | 'validate' | 'preview' | 'importing' | 'complete'>;
  readonly file: Signal<File | null>;
  readonly validRows: Signal<T[]>;
  readonly invalidRows: Signal<{ row: Partial<T>; index: number; errors: string[] }[]>;
  readonly progress: Signal<number>;
  readonly successCount: Signal<number>;
  readonly errorCount: Signal<number>;
  selectFile(file: File): Promise<void>;
  setColumnMap(map: Record<string, keyof T>): void;
  validate(): void;
  import(): Promise<void>;
  reset(): void;
};
```

## Implementation Plan

1. Scaffold `angular/packages/angular-import/`.
2. Implement multi-phase state machine.
3. Implement file parsing, column mapping, validation.
4. Add tests.
5. Register in workspace.
