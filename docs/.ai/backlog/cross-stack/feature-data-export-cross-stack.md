---
id: feature-data-export-cross-stack
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.DataExport + @hexguard/angular-data-export'
---

# Data Export / Portability Cross-Stack Pair

## Summary

Server-side data aggregation and export generation + client-side export request and download management.

### .NET (`HexGuard.DataExport`)
Multi-source data aggregation, export packaging (ZIP), lifecycle management, secure one-time download tokens, size estimation, auto-expiry, provider registration pattern.

### Angular (`@hexguard/angular-data-export`)
Export request with format selection, status tracking (queued→processing→ready→expired), progress indicator, download management, export history, size estimation display, cancellation.

### Integration Contract
```typescript
interface DataExportEndpoints {
  'POST /api/data-export': { body: ExportRequest; response: ExportJob };
  'GET /api/data-export/{id}': { response: ExportJob };
  'GET /api/data-export/history': { response: ExportJob[] };
  'GET /api/data-export/{id}/download': { params: { token: string }; response: Blob };
  'GET /api/data-export/estimate': { response: ExportSizeEstimate };
  'DELETE /api/data-export/{id}': { response: void };
}
```
