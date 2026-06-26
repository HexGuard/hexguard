---
id: feature-angular-csv
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-csv'
---

# @hexguard/angular-csv

## Summary

CSV parsing and generation utilities for Angular — parse CSV strings to typed arrays with header mapping, export typed arrays to CSV with download trigger. Every admin panel with import/export needs CSV handling.

**Competition check:** Pure JS CSV libraries exist (papaparse) but aren't Angular-specific or signal-based.

## Goals

1. Provide `injectCsvParser()` — parse CSV with typed column mapping and validation.
2. Provide `injectCsvGenerator()` — generate and download CSV from typed data.
3. Support delimiter customization, header detection, quoting, escaping.
4. Support typed transforms and validation.

## Proposed Public API

```typescript
export interface CsvParserConfig<T> {
  delimiter?: string;
  hasHeader?: boolean;
  quoteChar?: string;
  skipEmptyLines?: boolean;
  columnMap?: Record<string, keyof T>;
  validate?: (row: Partial<T>) => string[];
}

export function injectCsvParser<T extends Record<string, unknown>>(config?: CsvParserConfig<T>): {
  readonly parsing: Signal<boolean>;
  readonly progress: Signal<number>;
  readonly data: Signal<T[]>;
  readonly errors: Signal<CsvRowError[]>;
  parse(text: string): Promise<T[]>;
  parseFile(file: File): Promise<T[]>;
  cancel(): void;
};

export function injectCsvGenerator(): {
  readonly generating: Signal<boolean>;
  generate<T>(data: T[], config?: {
    delimiter?: string; includeHeader?: boolean;
    columns?: { key: keyof T; header: string; format?: (v: T[keyof T]) => string }[];
  }): Blob;
  download<T>(data: T[], filename: string, config?: CsvGeneratorConfig<T>): void;
};
```

## Implementation Plan

1. Scaffold `angular/packages/angular-csv/`.
2. Implement CSV parser with RFC 4180 compliance.
3. Implement CSV generator with typed columns.
4. Add tests.
5. Register in workspace.
