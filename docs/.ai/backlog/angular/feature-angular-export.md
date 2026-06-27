---
id: feature-angular-export
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-export'
---

# @hexguard/angular-export

## Summary

Headless export/download trigger state — progress tracking, format selection, cancellation, and history. For CSV/PDF/Excel export buttons in data grids, reports, and dashboards.

## Goals

- Export trigger with format selection (CSV, PDF, Excel, JSON)
- Progress tracking (preparing → generating → downloading → complete)
- Cancellation support for long-running exports
- Export history with re-download capability
- Error handling with retry
- Debounced export to prevent double-clicks
- Estimated completion time for server-side exports

## Non-Goals

- No actual data transformation (server handles generation)
- No file format conversion
- No export scheduling (that's angular-report-viewer)

## Proposed Public API

```typescript
export function injectExport(config: {
  endpoint: string;
  formats?: ('csv' | 'pdf' | 'xlsx' | 'json')[];
}): {
  readonly status: Signal<'idle' | 'preparing' | 'generating' | 'downloading' | 'complete' | 'error'>;
  readonly progress: Signal<{ percent: number; estimatedSeconds?: number }>;
  readonly lastExport: Signal<ExportRecord | null>;
  readonly history: Signal<ExportRecord[]>;
  readonly error: Signal<string | null>;
  readonly isExporting: Signal<boolean>;
  export(params?: ExportParams): Promise<void>;
  cancel(): void;
  downloadLast(): void;
  clearHistory(): void;
};

export interface ExportParams {
  format: 'csv' | 'pdf' | 'xlsx' | 'json';
  filters?: Record<string, unknown>;
  filename?: string;
}

export interface ExportRecord {
  id: string;
  format: string;
  filename: string;
  requestedAt: Date;
  completedAt?: Date;
  status: 'pending' | 'completed' | 'failed';
  downloadUrl?: string;
}
```

## Implementation Plan

1. Scaffold `angular/packages/angular-export/`.
2. Implement export trigger, progress tracking, history with signals.
3. Add cancellation and error recovery.
4. Add tests. Register in workspace.
