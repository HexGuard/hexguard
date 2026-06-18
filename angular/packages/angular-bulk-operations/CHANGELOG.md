# Changelog

## 0.1.0

- Initial release.
- `BulkOperationService` with generic typed contracts (TItem, TResult, TPayload).
- Signals: results, summary (total/succeeded/failed), inProgress, error.
- `provideBulkOperation()` with unique token per instance for multi-op support.
- `injectBulkOperation(token?)` facade with optional token disambiguation.
- `selectedItemsToBulkRequest()` composition with `@hexguard/angular-selection-state`.
- In-flight request deduplication.
- `retryFailed()` for re-executing only failed items.
