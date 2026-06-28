---
id: feature-angular-report-viewer
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-report-viewer'
---

# @hexguard/angular-report-viewer

## Summary

Report viewing state â€” list, preview, parameter input, schedule, download history. Pairs with `HexGuard.Reporting`.


## Goals

- Provide reactive, signal-based headless state for Angular applications
- Dependency-free at runtime beyond Angular core and tslib
- SSR-safe with TransferState awareness where applicable


## Non-Goals

- No rendered UI components — headless state, signals, and services only
- No browser globals or window-dependent code without SSR guard
- No backend API calls (consumer provides data/endpoints)

## Proposed Public API

```typescript
export function injectReportViewer(config: { endpoint: string }): {
  readonly reports: Signal<ReportInfo[]>;
  readonly selectedReport: Signal<ReportInfo | null>;
  readonly preview: Signal<{ html: string } | null>;
  readonly parameters: Signal<Record<string, unknown>>;
  readonly isLoading/error/generating: Signal<boolean>;
  generate(params?: Record<string, unknown>): Promise<void>;
  download(reportId: string, format: string): Promise<void>;
  schedule(reportId: string, cron: string, recipients: string[]): Promise<void>;
};
```

## Implementation Plan
1. Scaffold `angular/packages/angular-report-viewer/`.
2. Implement report list, preview, parameter input, download with signals.
3. Add tests. Register in workspace.
