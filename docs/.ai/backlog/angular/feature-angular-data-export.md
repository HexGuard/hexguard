---
id: feature-angular-data-export
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-data-export'
---

# @hexguard/angular-data-export

## Summary

Headless user data export state — request, track, download, and manage personal data exports. For GDPR data portability, account closure exports, and "Download My Data" features.

## Goals

- Request data export for current user
- Track export job status (queued → processing → ready → expired)
- Download export when ready
- Export format selection (JSON, CSV, PDF)
- Export history with re-download
- Export expiry (auto-delete after N days)
- Size estimation before requesting
- Cancel in-progress export

## Non-Goals

- No actual data export generation (server-side)
- No data anonymization
- No retention policy enforcement

## Proposed Public API

```typescript
export function injectDataExport(config: {
  endpoint: string;
}): {
  readonly exports: Signal<DataExport[]>;
  readonly activeExport: Signal<DataExport | null>;
  readonly status: Signal<'idle' | 'requesting' | 'processing' | 'ready' | 'error'>;
  readonly progress: Signal<number>;
  readonly isRequesting: Signal<boolean>;
  request(format?: ExportFormat): Promise<void>;
  download(exportId: string): Promise<void>;
  cancel(): Promise<void>;
  deleteExport(exportId: string): Promise<void>;
  estimateSize(): Promise<{ estimatedBytes: number; categories: Record<string, number> }>;
};

export interface DataExport {
  id: string;
  status: 'queued' | 'processing' | 'ready' | 'expired' | 'failed';
  format: ExportFormat;
  requestedAt: Date;
  completedAt?: Date;
  expiresAt?: Date;
  downloadUrl?: string;
  sizeBytes?: number;
}

export type ExportFormat = 'json' | 'csv' | 'pdf';
```

## Implementation Plan
1. Scaffold `angular/packages/angular-data-export/`.
2. Implement request, tracking, download, history with signals.
3. Add expiry awareness and size estimation.
4. Add tests. Register in workspace.
