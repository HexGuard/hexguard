---
id: package-extensions
type: feature
status: proposed
created: 2026-06-25
---

# Package Extensions

This file catalogs proposed extensions to **existing** HexGuard packages — additive improvements that enhance existing packages without changing their core contracts. Each extension is lightweight compared to a new package: it may add a single function, an additional export, or an optional sub-module.

---

## Angular Extensions

### 1. `@hexguard/angular-url-state` — Array & nested query param support

**Problem:** The current `QuerySchema` supports flat string/number/boolean values. Many filter UIs need multi-value params (`?tags=a,b,c`) and nested object params (`?filter[name]=foo&filter[age]=25`).

**Proposal:**
```typescript
// Array codec
const TagsCodec = arrayCodec(stringCodec); // ?tags=a,b,c → ['a', 'b', 'c']

// Nested object codec (dot-notation)
const FilterCodec = objectCodec({
  name: stringCodec,
  age: numberCodec,
}); // ?filter.name=foo&filter.age=25 → { name: 'foo', age: 25 }
```

**Effort:** Medium. Requires new codec factories, serialization/parsing logic, and edge case handling (empty arrays, commas in values, encoding).

---

### 2. `@hexguard/angular-url-state` — Partial update API

**Problem:** Updating a subset of query params requires reading the entire schema, merging, and writing back:
```typescript
const current = urlState.state();
urlState.set({ ...current, page: 2 }); // Boilerplate
```

**Proposal:** Add `updateQueryParams(partial: Partial<Schema>)` that merges automatically:
```typescript
urlState.update({ page: 2 }); // Preserves all other params
```

**Effort:** Low. Add a single method on the URL state handle.

---

### 3. `@hexguard/angular-async-state` — Polling extension

**Problem:** `AsyncValue` loads once. Many UIs need auto-refresh on an interval (dashboard widgets, live monitors). Currently each consumer re-implements polling + timer + cleanup.

**Proposal:** Add `withPolling(intervalMs)` modifier (or separate factory):
```typescript
const value = injectAsyncValue<UserStatus>();
const polling = value.withPolling(10_000); // Poll every 10s

// Returns polling controller:
polling.start();
polling.stop();
polling.isPolling; // Signal<boolean>

// Auto-stops when tab is hidden (if injectVisibility is available)
```

**Effort:** Medium. New function/module that wraps `AsyncValue` with `setInterval` + visibility-aware pause.

---

### 4. `@hexguard/angular-async-state` — Retry support for AsyncAction

**Problem:** `AsyncAction.execute()` fails fast. Transient network errors (timeouts, 503s) need retry with backoff.

**Proposal:** Add `withRetry(opts?)` modifier:
```typescript
const action = injectAsyncAction();
const withRetry = action.withRetry({ maxRetries: 3, baseDelayMs: 1000, backoff: 'exponential' });
await withRetry.execute(() => api.post('/items', data));
```

**Effort:** Low-Medium. Add retry logic to the action execution pipeline.

---

### 5. `@hexguard/angular-storage` — Cookie storage backend

**Problem:** `angular-storage` supports `localStorage` and `sessionStorage`. SSR/SSR-hybrid apps need cookie access for tokens and preferences that must be available on the server.

**Proposal:** Add a `CookieStorage` adapter:
```typescript
const storage = injectStorage({ backend: cookieStorage({ path: '/', secure: true, sameSite: 'lax' }) });
const theme = storage.get('theme'); // Reads from document.cookie
storage.set('theme', 'dark');       // Writes to document.cookie
```

**Effort:** Medium. Requires cookie serialization/parsing, path/domain/secure/expiry options, and SSR guard.

---

### 6. `@hexguard/angular-storage` — Migration layer

**Problem:** When the shape of stored data changes between app versions (schema evolution), stale localStorage entries cause runtime errors.

**Proposal:** Add schema versioning with `onUpgrade` callback:
```typescript
const storage = injectStorage({
  version: 2,
  onUpgrade(from, to, raw) {
    if (from === 1 && to === 2) {
      return { ...raw, migratedAt: Date.now() };
    }
    return raw;
  }
});
```

**Effort:** Low. Add version metadata to stored values, run upgrade on read.

---

### 7. `@hexguard/angular-pagination` — Cursor-based pagination

**Problem:** The current `PaginationHandle` is page/offset-based. Modern APIs (GraphQL, REST cursor conventions) use cursor-based pagination (`?cursor=abc123&limit=20`).

**Proposal:** Add `CursorPaginationHandle` alongside the existing page-based handle:
```typescript
const cursor = injectCursorPagination({ limit: 20 });
cursor.setNextCursor('abc123');
cursor.hasMore; // Signal<boolean>
cursor.cursors; // Signal<string[]> — history for "back" navigation
```

**Effort:** Medium. New handle type sharing the existing `PaginationHandle` interface contract.

---

### 8. `@hexguard/angular-notifications` — Notification grouping

**Problem:** Repeated notifications of the same type (e.g., 5 "Upload failed" errors) flood the notification queue.

**Proposal:** Support grouping by type with a count badge:
```typescript
notify.error('Upload failed', { groupBy: 'upload-error' });
// → Queues one notification with count: 5 instead of 5 separate toasts
```

**Effort:** Low. Track group counts in the notification service; consumers render the badge.

---

### 9. `@hexguard/angular-notifications` — Notification history

**Problem:** Dismissed notifications are lost. Users need a "View all notifications" panel for past alerts.

**Proposal:** Add `NotificationHistoryService` that persists dismissed notifications to `angular-storage`:
```typescript
const history = injectNotificationHistory();
history.recent(50); // Signal<Notification[]> — last 50 dismissed notifications
history.clear();
```

**Effort:** Medium. Requires storage integration, TTL, and max-entry limits.

---

### 10. `@hexguard/angular-form-drafts` — Server-side draft sync

**Problem:** Drafts are localStorage-only. Users on different devices cannot resume drafts.

**Proposal:** Add optional sync adapter:
```typescript
const draft = injectFormDraft<MyForm>('order-form', {
  sync: {
    push: (data) => api.put('/drafts/order-form', data),
    pull: () => api.get('/drafts/order-form'),
    strategy: 'local-first', // or 'remote-first'
  }
});
```

**Effort:** Medium. Add sync interface, conflict resolution strategy, and periodic sync.

---

### 11. `@hexguard/angular-file-picker` — Chunked upload pipeline

**Problem:** `FilePicker` handles selection and validation. Upload is left to the consumer. Large files need chunked upload with progress tracking per chunk.

**Proposal:** Add `withUpload()` extension:
```typescript
const picker = injectFilePicker();
const uploader = picker.withUpload({
  chunkSize: 1024 * 1024, // 1MB
  endpoint: '/upload',
  maxConcurrent: 3,
  onProgress: (pct) => console.log(`${pct}%`),
});

// After picking files:
await uploader.start();
uploader.progress; // Signal<number> 0–100
uploader.isUploading; // Signal<boolean>
```

**Effort:** High. Requires chunk slicing, concurrent upload management, retry per chunk, pause/resume.

---

### 12. `@hexguard/angular-live-data` — SignalR/WebSocket adapter

**Problem:** `LiveData` polls on an interval. Real-time apps (chat, dashboards, notifications) need push-based updates with polling as fallback.

**Proposal:** Add WebSocket/SignalR connection as a push source:
```typescript
const live = injectLiveData<User[]>({
  pollInterval: 30_000,              // Fallback polling
  push: signalRChannel('users:updated'), // Real-time push
});
```

**Effort:** Medium. Add push source interface, connect/poll fallback logic.

---

### 13. `@hexguard/angular-selection-state` — Range & keyboard selection

**Problem:** Current selection is checkbox-style (toggle per item). Data grids need shift-click range selection and keyboard-driven selection (arrow+shift).

**Proposal:** Extend `SelectionState` with range helpers:
```typescript
selection.selectRange(fromIndex, toIndex); // Shift-click
selection.selectNext();   // Arrow down
selection.selectPrev();   // Arrow up
selection.anchorIndex;    // Signal<number | null>
```

**Effort:** Medium. Add index-based range logic, keyboard event handling, anchor tracking.

---

### 14. `@hexguard/angular-undo` — Group undo

**Problem:** Complex operations (e.g., "paste 10 rows") produce 10 individual undo entries. Users expect one undo for the entire paste action.

**Proposal:** Add grouping support:
```typescript
undo.runGrouped('Paste rows', () => {
  for (const row of rows) {
    undo.push('add-row', row, () => removeRow(row.id));
  }
});
// → One undo entry labeled "Paste rows" that reverses all 10 actions
```

**Effort:** Low. Add grouping context to the undo stack.

---

### 15. `@hexguard/angular-permissions` — Hierarchical/inherited permissions

**Problem:** Current permission evaluation is flat. Real-world RBAC has hierarchy (Admin inherits Editor, Editor inherits Viewer).

**Proposal:** Add hierarchy support to the permission evaluator:
```typescript
const permissions = injectPermissions({
  hierarchy: {
    admin: ['editor', 'viewer'],
    editor: ['viewer'],
    viewer: [],
  }
});

permissions.hasRole('viewer');    // true if admin
permissions.hasRole('editor');    // true if admin
```

**Effort:** Low. Add role hierarchy map to the evaluator, resolve inherited roles recursively.

---

## .NET Extensions

### 16. `HexGuard.Pagination` — Cursor-based contracts

**Problem:** `HexGuard.Pagination` has `QueryRequest`/`QueryResponse<T>` with page/pageSize. Many modern APIs use cursor-based pagination exclusively.

**Proposal:** Add `CursorRequest` and `CursorResponse<T>`:
```csharp
public sealed record CursorRequest
{
    public string? Cursor { get; init; }
    public int Limit { get; init; } = 20;
    public SortSpec[]? Sort { get; init; }
}

public sealed record CursorResponse<T>
{
    public required IReadOnlyList<T> Items { get; init; }
    public string? NextCursor { get; init; }
    public bool HasMore { get; init; }
}
```

**Effort:** Low. Add new records, keep existing page-based contracts unchanged.

---

### 17. `HexGuard.ProblemDetails` — ValidationProblemDetails

**Problem:** RFC 9457 defines an `invalid-params` extension for validation errors. The current `HexGuard.ProblemDetails` doesn't include this extension out of the box.

**Proposal:** Add `ValidationProblemDetails` that extends `ProblemDetails` with an `Errors` collection:
```csharp
public sealed record ValidationProblemDetails : ProblemDetails
{
    public IReadOnlyList<ValidationError> Errors { get; init; }
}

public static class ValidationProblemDetailsFactory
{
    public static ValidationProblemDetails Create(
        IReadOnlyList<ValidationError> errors,
        string? title = "Validation Failed",
        int statusCode = 400);
}
```

**Effort:** Low. Add a new record and factory, reuse existing `HexGuard.ValidationContracts.ValidationError`.

---

### 18. `HexGuard.ValidationContracts` — FluentValidation adapter

**Problem:** `ValidationContracts` defines the error contract. `FluentValidation` is the most popular .NET validation library. There's no bridge between them.

**Proposal:** Add an adapter in a sub-namespace or companion package:
```csharp
// HexGuard.ValidationContracts.FluentValidation
public static class FluentValidationAdapter
{
    public static ValidationError[] ToValidationErrors(
        this ValidationResult fluentResult);

    public static ValidationError ToValidationError(
        this ValidationFailure failure);
}
```

**Effort:** Low. Add mapping functions from FluentValidation types to `ValidationError` records.

---

### 19. `HexGuard.FeatureFlags` — Percentage rollout & multi-variant

**Problem:** The current `IFeatureFlagService` returns boolean (on/off). Production needs gradual rollouts (10% of users) and A/B testing (control/variantA/variantB).

**Proposal:** Add percentage-based targeting and multi-variant evaluation:
```csharp
// Percentage rollout
public sealed record PercentageRollout
{
    public int Percentage { get; init; }     // 0–100
    public Func<string, int> Hasher { get; init; }
        = userId => Math.Abs(userId.GetHashCode()) % 100;
}

// Multi-variant
public interface IExperimentService
{
    string? GetVariant(string experimentId, string userId);
    // Returns "control", "variantA", "variantB", or null
}
```

**Effort:** Medium. Add targeting evaluator, experiment service, and storage for variant assignments.

---

### 20. `HexGuard.ReferenceData` — Hierarchical reference data

**Problem:** Current `ReferenceDataCatalog` handles flat lookup lists. Enterprise apps need tree-structured reference data (org chart, category tree, taxonomy).

**Proposal:** Add hierarchical catalog support:
```csharp
public sealed record TreeNode<T>
{
    public required T Value { get; init; }
    public IReadOnlyList<TreeNode<T>> Children { get; init; } = [];
}

public interface IHierarchicalCatalog<TId, TValue>
{
    Task<TreeNode<TValue>?> GetTreeAsync(TId rootId);
    Task<IReadOnlyList<TValue>> GetAncestorsAsync(TId id);
    Task<IReadOnlyList<TValue>> GetDescendantsAsync(TId id);
}
```

**Effort:** Medium. Add tree model, traversal helpers, and optional caching.

---

### 21. `HexGuard.Capabilities` — Policy-based evaluation

**Problem:** Current capability evaluation is role/permission-based. Complex apps need policy-based authorization (e.g., "can edit documents in workspace X if user is a member and document is not locked").

**Proposal:** Add policy evaluator:
```csharp
public interface ICapabilityPolicy
{
    string PolicyName { get; }
    Task<bool> EvaluateAsync(CapabilityContext context);
}

public sealed record CapabilityContext
{
    public required string UserId { get; init; }
    public required string ResourceType { get; init; }
    public string? ResourceId { get; init; }
    public IReadOnlyDictionary<string, object> Attributes { get; init; } = [];
}

// Registration
builder.Services.AddCapabilityPolicy<DocumentEditPolicy>("document:edit");
```

**Effort:** Medium. Add policy interface, registration, composite evaluator.

---

### 22. `HexGuard.BulkOperations` — Streaming response support

**Problem:** `BulkOperationResult<T>` returns all results at once. For large operations (10,000+ items), consumers wait for everything to complete before seeing any results.

**Proposal:** Add streaming response via `IObservable<BulkItemResult>` or `IAsyncEnumerable<BulkItemResult>`:
```csharp
public sealed class StreamingBulkOperation<TRequest, TResponse>
{
    public IAsyncEnumerable<BulkItemResult<TResponse>> ExecuteAsync(
        IReadOnlyList<TRequest> requests,
        CancellationToken ct);
}
```

**Effort:** Medium. Add streaming variant, adapt existing bulk executor.

---

### 23. `@hexguard/angular-feature-flags` — Remote config reload

**Problem:** Feature flag states are evaluated once at app startup. When flags change on the server (A/B test activation, emergency kill switch), the Angular app doesn't pick up changes until the user refreshes.

**Proposal:** Add `withRemoteReload(intervalMs)` option that periodically re-fetches the flag config from the server and updates signals without page reload:
```typescript
const flags = injectFeatureFlags({
  endpoint: '/api/feature-flags',
  remoteReload: { intervalMs: 60_000 },   // Poll every 60s
  // or: remoteReload: { strategy: 'websocket' }
});
// Flags update reactively when server config changes
```

**Effort:** Medium. Add polling/socket module to the existing feature-flags package.

---

### 24. `@hexguard/angular-async-state` — Cache layer with TTL

**Problem:** `AsyncValue.load()` fetches every time. When the same data is needed by multiple components or within a short time window, it re-fetches unnecessarily.

**Proposal:** Add `withCache(ttl)` modifier that skips re-fetch if cached data is still fresh:
```typescript
const users = injectAsyncValue<User[]>();
const cached = users.withCache({ ttl: 30_000 });  // 30-second cache
await cached.load(() => api.getUsers());           // Skips fetch if cache hit
cached.isFresh;  // Signal<boolean>
cached.staleAt;  // Signal<Date | null>
```

**Effort:** Medium. Add cache layer with TTL, stale detection, and optional background refresh.

---

### 25. `@hexguard/angular-pagination` — Page size persistence

**Problem:** Users expect their preferred page size to persist across sessions and navigations.

**Proposal:** Add `persistPageSize(key)` that saves the user's page size preference to storage:
```typescript
const pagination = injectPagination({
  persistPageSize: 'products-page-size',   // Saves to localStorage
  defaultPageSize: 20,
});
// User changes to 50 → persisted. Next visit → loads 50.
```

**Effort:** Low. Add storage read/write to page size setter.

---

### 26. `@hexguard/angular-undo` — Keyboard shortcuts (Ctrl+Z/Ctrl+Shift+Z)

**Problem:** Users expect standard undo/redo keyboard shortcuts, but the current undo stack requires programmatic calls.

**Proposal:** Add built-in keyboard shortcut support via `withKeyboardShortcuts()`:
```typescript
const undo = injectUndo();
undo.withKeyboardShortcuts();  // Ctrl+Z → undo(), Ctrl+Shift+Z → redo()
// Auto-cleanup on destroy
```

**Effort:** Low. Register document-level keydown listeners with DestroyRef cleanup.

---

### 27. `HexGuard.ProblemDetails` — Exception-to-ProblemDetails middleware

**Problem:** Unhandled exceptions produce a raw `500` with no structured error body. Every API needs middleware that catches unhandled exceptions and returns RFC 9457 ProblemDetails.

**Proposal:** Add middleware that auto-catches exceptions and maps them to ProblemDetails:
```csharp
app.UseProblemDetailsExceptions(options => {
    options.Map<NotFoundException>(404, "Resource not found");
    options.Map<ValidationException>(400, "Validation failed");
    options.IncludeStackTrace = env.IsDevelopment();
});
```

**Effort:** Low. Add middleware + exception mapping config, reuse existing `ProblemDetails` types.

---

### 28. `HexGuard.Pagination` — OpenAPI annotation for paginated responses

**Problem:** Paginated endpoints don't document their query params (`page`, `pageSize`, `sort`) in OpenAPI schemas, making generated API clients incomplete.

**Proposal:** Add OpenAPI annotation extension that auto-documents pagination parameters:
```csharp
app.MapGet("/products", GetProducts)
   .WithPagination();   // Auto-adds page, pageSize, sort to OpenAPI
```

**Effort:** Low. Add OpenAPI document filter that reads `QueryRequest` properties.

---

### 29. `HexGuard.FeatureFlags` — Flag audit log

**Problem:** When a flag evaluation changes behavior in production, teams need to know who changed which flag, when, and what the previous value was.

**Proposal:** Add an `IFeatureFlagAuditLog` that records all flag state changes:
```csharp
public interface IFeatureFlagAuditLog
{
    Task RecordChangeAsync(string flagId, bool oldValue, bool newValue, string changedBy);
    Task<IReadOnlyList<FlagChange>> GetHistoryAsync(string flagId, int limit = 50);
}
```

**Effort:** Medium. Add audit log interface, in-memory and EF Core implementations.

---

### 30. `HexGuard.ValidationContracts` — Auto-validate request body middleware

**Problem:** Every endpoint needs to validate its request body and return standardized errors. Currently, each endpoint must call validators manually.

**Proposal:** Add middleware that auto-validates request bodies against `IValidatableObject` or registered validators before the handler runs:
```csharp
app.UseAutoValidation();   // Catches invalid bodies, returns 400 ProblemDetails

// The endpoint handler only runs if validation passes
app.MapPost("/items", (CreateItemRequest request) => {
    // request is guaranteed valid here
});
```

**Effort:** Low. Add middleware + `IEndpointFilter` that runs before the handler, reusing `ValidationContracts` error types.

---

### 31. `@hexguard/angular-wizard-state` — Step persistence

**Problem:** If a user closes the browser mid-wizard, their progress (current step + entered data) is lost and they must start over.

**Proposal:** Add `persistTo(key)` option that saves current step and form data to storage on every step change:
```typescript
const wizard = injectWizardState({
  persistTo: 'order-wizard',    // Auto-saves to localStorage
});
// On init, wizard auto-restores from saved state
wizard.hasSavedProgress;  // Signal<boolean>
wizard.clearSavedProgress();
```

**Effort:** Low. Add serialize/deserialize of step + data to storage.

---

### 32. `@hexguard/angular-route-memory` — Multi-tab memory

**Problem:** `RouteMemoryService` uses a single namespace. When a user opens two browser tabs, both tabs share the same saved state, causing conflicts.

**Proposal:** Add `sessionStorage` backend with tab-unique key (via sessionStorage — each tab gets its own storage) for tab-isolated memory:
```typescript
const memory = injectRouteMemory({ backend: 'sessionStorage' });
// Each tab has independent memory — no cross-tab interference
```

**Effort:** Medium. Add sessionStorage backend with per-tab isolation.

---

### 33. `@hexguard/angular-notifications` — Priority levels

**Problem:** All notifications are treated equally. Critical errors (payment failed) need to persist; low-priority info (item updated) should auto-dismiss quickly.

**Proposal:** Add priority levels with different display behavior:
```typescript
type NotificationPriority = 'high' | 'medium' | 'low';

notify.error('Payment failed', { priority: 'high', persistent: true });
notify.info('Item updated', { priority: 'low', autoDismissMs: 2000 });
```

**Effort:** Low. Add priority field, auto-dismiss override, persistent flag.

---

### 34. `@hexguard/angular-breakpoint-observer` — Element-level observer

**Problem:** Current `BreakpointObserver` observes the viewport. For responsive components inside a sidebar or panel (narrow container), the viewport breakpoint doesn't reflect the actual available space.

**Proposal:** Add `injectElementBreakpoint(host)` that observes a specific element's width instead of the viewport:
```typescript
const elBreakpoint = injectElementBreakpoint(hostElementRef);
elBreakpoint.width();       // Signal<number>
elBreakpoint.above('md');   // Signal<boolean> — based on element width
```

**Effort:** Medium. Add `ResizeObserver`-based breakpoint detection per element.

---

### 35. `@hexguard/angular-confirmation` — Confirmation queue

**Problem:** When multiple destructive actions fire in sequence, each confirmation dialog appears independently. The second one should wait for the first to resolve.

**Proposal:** Add queuing support — `ask()` calls queue instead of rejecting when one is already open:
```typescript
// With queue enabled, confirmations run in sequence:
confirm.ask('Delete item 1?');  // Shows first
confirm.ask('Delete item 2?');  // Queued — shows after first resolves
confirm.queueLength;  // Signal<number>
```

**Effort:** Low. Add internal `Queue<ConfirmationRequest>` with FIFO processing.

---

### 36. `HexGuard.ReferenceData` — Response caching middleware

**Problem:** Reference data (countries, categories, statuses) changes infrequently but is fetched on every page load. No built-in caching.

**Proposal:** Add middleware that caches reference data API responses with configurable TTL:
```csharp
app.MapReferenceData("/api/reference-data", catalog)
   .Cache(ttl: "01:00:00");   // Cache for 1 hour
// Returns 304 Not Modified on If-None-Match + ETag
```

**Effort:** Low. Add ETag-based response caching wrapper.

---

### 37. `HexGuard.BulkOperations` — Per-item progress tracking

**Problem:** During bulk execution, consumers see only the final result. For large batches, they don't know which items succeeded/failed until the end.

**Proposal:** Add live per-item progress via `IAsyncEnumerable<BulkItemProgress>`:
```csharp
public sealed record BulkItemProgress(string ItemId, string Status, string? Error, int Completed, int Total);

public IAsyncEnumerable<BulkItemProgress> ExecuteWithProgressAsync(
    IReadOnlyList<TRequest> requests, CancellationToken ct);
```

**Effort:** Medium. Add streaming progress variant using `IAsyncEnumerable`.

---

### 38. `@hexguard/angular-feature-flags` — Route guard with redirect configuration

**Problem:** `CanActivateFn` returned by feature flags needs a redirect URL — currently consumers must build the redirect themselves.

**Proposal:** Add `withFeatureFlag()` route guard that accepts a redirect path:
```typescript
const routes = [
  { path: 'beta', loadComponent: BetaComponent,
    canActivate: [withFeatureFlag('beta', { redirectTo: '/upgrade' })] },
];
```

**Effort:** Low. Add redirect configuration to the route guard factory.

---

## Summary Table

| #  | Package | Extension | Stack | Effort | Value |
|----|---------|-----------|-------|--------|-------|
| 1  | `angular-url-state` | Array/nested param codecs | Angular | Medium | ⭐ High |
| 2  | `angular-url-state` | Partial update API | Angular | Low | ⭐ High |
| 3  | `angular-async-state` | Polling extension | Angular | Medium | ⭐ High |
| 4  | `angular-async-state` | Retry for AsyncAction | Angular | Low-Med | High |
| 5  | `angular-storage` | Cookie backend | Angular | Medium | High |
| 6  | `angular-storage` | Migration layer | Angular | Low | High |
| 7  | `angular-pagination` | Cursor pagination | Angular | Medium | High |
| 8  | `angular-notifications` | Notification grouping | Angular | Low | Medium |
| 9  | `angular-notifications` | Notification history | Angular | Medium | Medium |
| 10 | `angular-form-drafts` | Server sync | Angular | Medium | High |
| 11 | `angular-file-picker` | Chunked upload pipeline | Angular | High | High |
| 12 | `angular-live-data` | SignalR/WS adapter | Angular | Medium | High |
| 13 | `angular-selection-state` | Range & keyboard sel. | Angular | Medium | High |
| 14 | `angular-undo` | Group undo | Angular | Low | High |
| 15 | `angular-permissions` | Hierarchy support | Angular | Low | Medium |
| 16 | `HexGuard.Pagination` | Cursor contracts | .NET | Low | ⭐ High |
| 17 | `HexGuard.ProblemDetails` | ValidationPD | .NET | Low | ⭐ High |
| 18 | `HexGuard.ValidationContracts` | FluentValidation adapter | .NET | Low | High |
| 19 | `HexGuard.FeatureFlags` | Percentage rollout & A/B | .NET | Medium | High |
| 20 | `HexGuard.ReferenceData` | Hierarchical catalog | .NET | Medium | Medium |
| 21 | `HexGuard.Capabilities` | Policy-based evaluation | .NET | Medium | Medium |
| 22 | `HexGuard.BulkOperations` | Streaming response | .NET | Medium | High |
| 23 | `@hexguard/angular-feature-flags` | Remote config reload | Angular | Medium | High |
| 24 | `@hexguard/angular-async-state` | Cache layer (TTL) | Angular | Medium | ⭐ High |
| 25 | `@hexguard/angular-pagination` | Page size persistence | Angular | Low | Medium |
| 26 | `@hexguard/angular-undo` | Keyboard shortcuts (Ctrl+Z) | Angular | Low | High |
| 27 | `HexGuard.ProblemDetails` | Exception-to-ProblemDetails middleware | .NET | Low | ⭐ High |
| 28 | `HexGuard.Pagination` | OpenAPI annotation for paginated responses | .NET | Low | Medium |
| 29 | `HexGuard.FeatureFlags` | Flag audit log (who changed what) | .NET | Medium | High |
| 30 | `HexGuard.ValidationContracts` | Auto-validate request body middleware | .NET | Low | ⭐ High |
| 31 | `@hexguard/angular-wizard-state` | Step persistence | Angular | Low | High |
| 32 | `@hexguard/angular-route-memory` | Multi-tab memory | Angular | Medium | Medium |
| 33 | `@hexguard/angular-notifications` | Priority levels | Angular | Low | Medium |
| 34 | `@hexguard/angular-breakpoint-observer` | Element-level observer | Angular | Medium | High |
| 35 | `@hexguard/angular-confirmation` | Confirmation queue | Angular | Low | High |
| 36 | `HexGuard.ReferenceData` | Response caching middleware | .NET | Low | High |
| 37 | `HexGuard.BulkOperations` | Per-item progress tracking | .NET | Medium | High |
| 38 | `@hexguard/angular-feature-flags` | Route guard with redirect config | Angular | Low | Medium |
| 39 | `@hexguard/angular-async-state` | `withTimeout(ms)` — auto-fail on timeout | Angular | Low | High |
| 40 | `@hexguard/angular-debounce` | `debouncedSignal(writable, ms)` — WritableSignal debounce | Angular | Low | High |
| 41 | `@hexguard/angular-storage` | IndexedDB backend for large data (>5MB) | Angular | Medium | Medium |
| 42 | `@hexguard/angular-form-drafts` | `autoSaveOnChange` — save on every value change | Angular | Low | Medium |
| 43 | `@hexguard/angular-selection-state` | `selectVisible()`/`deselectVisible()` — respect filter | Angular | Low | High |
| 44 | `@hexguard/angular-pagination` | `withSearch()` — debounced search that resets to page 1 | Angular | Low | Medium |
| 45 | `HexGuard.ProblemDetails` | `ProblemDetails.IResult` integration — seamless `Results.Problem()` | .NET | Low | High |
| 46 | `HexGuard.FeatureFlags` | `IFeatureFlagStore` — pluggable storage (EF Core, Redis, file) | .NET | Medium | High |
| 47 | `@hexguard/angular-pagination` | `first()` / `last()` navigation helpers | Angular | Low | Medium |
| 48 | `@hexguard/angular-notifications` | Action buttons on toasts (callback + label) | Angular | Low | High |
| 49 | `@hexguard/angular-file-picker` | `generatePreviews()` — thumbnail DataURLs | Angular | Medium | High |
| 50 | `@hexguard/angular-form-drafts` | `diff()` — compare current form vs saved draft | Angular | Low | Medium |
| 51 | `@hexguard/angular-click-outside` | `excludeSelectors` — ignore clicks on overlays | Angular | Low | High |
| 52 | `@hexguard/angular-async-state` | `prefetch()` — pre-load data before navigation | Angular | Medium | High |
| 53 | `@hexguard/angular-live-data` | `pollStrategy` — fixed, exponential, adaptive | Angular | Medium | High |
| 54 | `HexGuard.ProblemDetails` | `LocalizedProblemDetails` — messages in user language | .NET | Medium | Medium |
| 55 | `@hexguard/angular-live-data` | `retryOnError` — auto-retry with backoff on poll failure | Angular | Low | High |
| 56 | `@hexguard/angular-notifications` | `notificationSounds` — optional audio feedback per type | Angular | Low | Low |
| 57 | `@hexguard/angular-pagination` | `withSelection()` — combine pagination with selection-state | Angular | Low | High |
| 58 | `@hexguard/angular-form-drafts` | `draftList()` — list all saved drafts across forms | Angular | Low | Medium |
| 59 | `@hexguard/angular-storage` | `storageUsed()` — estimated bytes used in localStorage | Angular | Low | Medium |
| 60 | `HexGuard.Pagination` | `PaginatedResponse<T>` — strongly-typed paginated wrapper | .NET | Low | High |
| 61 | `HexGuard.FeatureFlags` | `DefaultValue` fallback — flag default when store unavailable | .NET | Low | High |
| 62 | `HexGuard.BulkOperations` | `BulkOperationValidator` — validate all items before executing | .NET | Medium | High |
| 63 | `@hexguard/angular-url-state` | `resetToDefault()` — reset all params to schema defaults | Angular | Low | High |
| 64 | `@hexguard/angular-async-state` | `withDedupe(ms)` — deduplicate loads within time window | Angular | Low | High |
| 65 | `@hexguard/angular-undo` | `undoHistory` signal — list of undoable action descriptions | Angular | Low | Medium |
| 66 | `@hexguard/angular-pagination` | `visibleRange` — computed page range for pagination nav | Angular | Low | Medium |
| 67 | `@hexguard/angular-storage` | `import/export` — dump/restore all stored data | Angular | Low | Medium |
| 68 | `HexGuard.ProblemDetails` | `ProblemDetailsExtensions` — `.ToResult()` helper | .NET | Low | High |
| 69 | `HexGuard.ReferenceData` | `ReloadAsync()` — force-refresh catalog from source | .NET | Low | High |
| 70 | `HexGuard.Capabilities` | `ICapabilityCache` — cached capability evaluation | .NET | Medium | Medium |
| 71 | `@hexguard/angular-debounce` | `signalThrottle()` — throttle variant for signals | Angular | Low | Medium |
| 72 | `@hexguard/angular-storage` | `storageQuota()` — available/used bytes | Angular | Low | Low |
| 73 | `@hexguard/angular-live-data` | `backgroundRefresh` — refresh in background when stale | Angular | Medium | High |
| 74 | `@hexguard/angular-form-drafts` | `draftExpiry` — per-draft custom TTL | Angular | Low | Medium |
| 75 | `@hexguard/angular-error-boundary` | `onReset` callback — reset signal state on recover | Angular | Low | Medium |
| 76 | `HexGuard.Pagination` | `PaginationLinkBuilder` — HATEOAS prev/next links | .NET | Low | Medium |
| 77 | `HexGuard.FeatureFlags` | `FlagTargetingRules` — IP, geo, custom attribute rules | .NET | Medium | High |
| 78 | `HexGuard.BulkOperations` | `BulkOperationRetry` — retry failed items individually | .NET | Medium | High |
| 79 | `@hexguard/angular-async-state` | `withProgress()` — 0-100% progress in AsyncAction | Angular | Low | High |
| 80 | `@hexguard/angular-pagination` | `withExport()` — export current page/all to CSV | Angular | Medium | Medium |
| 81 | `@hexguard/angular-notifications` | `notificationCenter` — inbox-style panel state | Angular | Medium | High |
| 82 | `@hexguard/angular-feature-flags` | `canaryRelease` — percentage-based canary | Angular | Medium | High |
| 83 | `HexGuard.ProblemDetails` | `ProblemDetailsTelemetry` — auto-log + metrics on errors | .NET | Low | High |
| 84 | `HexGuard.FeatureFlags` | `ScheduledFlag` — auto-enable/disable at datetime | .NET | Medium | High |
| 85 | `HexGuard.ReferenceData` | `ReferenceDataVersioning` — catalog version tracking | .NET | Medium | Medium |
| 86 | `HexGuard.BulkOperations` | `BulkOperationMetrics` — duration, throughput, error rate | .NET | Low | Medium |
| 87 | `@hexguard/angular-async-state` | `withAuth()` — auto-attach auth token to async loads | Angular | Low | High |
| 88 | `@hexguard/angular-pagination` | `withApi()` — auto-bind to CRUD API endpoint | Angular | Medium | High |
| 89 | `@hexguard/angular-form-drafts` | `withServerSync()` — sync drafts to server | Angular | Medium | High |
| 90 | `@hexguard/angular-notifications` | `withPersistence()` — persist notification history | Angular | Low | Medium |
| 91 | `HexGuard.Pagination` | `AutoCrudQuery` — auto-apply to IQueryable | .NET | Medium | High |
| 92 | `HexGuard.ProblemDetails` | `ProblemDetailsFactory` — typed factory per exception type | .NET | Low | High |
| 93 | `HexGuard.FeatureFlags` | `FlagAtBuildTime` — tree-shake disabled features | .NET | Medium | Medium |
| 94 | `HexGuard.ValidationContracts` | `ValidationFilter` — auto-validate Minimal API params | .NET | Low | High |
| 95 | `@hexguard/angular-subscription` | `withPlanGate()` — feature flag check against current plan | Angular | Low | High |
| 96 | `@hexguard/angular-feature-flags` | `perPlan()` — plan-aware flag evaluation | Angular | Low | Medium |
| 97 | `HexGuard.Tenancy` | `TenantPlanEnforcement` — block features beyond tenant plan | .NET | Medium | High |
| 98 | `@hexguard/angular-orders` | `orderStatusTimeline` — computed status progression | Angular | Low | Medium |
| 99 | `HexGuard.Email` | `EmailTemplatePreview` — render + preview endpoint | .NET | Low | Medium |
| 100 | `@hexguard/angular-prompt` | `promptCompare` — side-by-side prompt version diff | Angular | Medium | Medium |
| 101 | `HexGuard.Media` | `cdnUrl` — auto-generate CDN URLs with variant support | .NET | Low | High |
| 102 | `@hexguard/angular-testing` | `fakeAsyncSignal` — signal-aware fakeAsync for zone-less | Angular | Medium | High |
| 103 | `@hexguard/angular-status` | `incidentTimeline` — visual incident history | Angular | Low | Medium |
| 104 | `@hexguard/angular-feature-flags` | `killSwitch` — operational emergency flags | Angular | Low | High |
| 105 | `HexGuard.Startup` | `DatabaseMigrationTask` — built-in migration startup task | .NET | Low | High |
| 106 | `HexGuard.Telemetry` | `CustomMetric<T>` — typed metric registration helper | .NET | Low | High |
| 107 | `@hexguard/angular-notifications` | `incidentAlert` — auto-notify on incident change | Angular | Medium | Medium |
| 108 | `HexGuard.RateLimiting` | `TenantRateLimit` — per-tenant rate limiting | .NET | Medium | High |
| 109 | `@hexguard/angular-backup` | `backupHistory` — backup list with restore capability | Angular | Medium | Medium |
| 110 | `HexGuard.Backup` | `BackupVerification` — auto-restore + verify integrity | .NET | Medium | High |
| 111 | `@hexguard/angular-debounce` | `withCancel()` — cancellation token support for debounced values | Angular | Low | High |
| 112 | `@hexguard/angular-url-state` | `debounceSync()` — debounced URL sync to avoid rapid history entries | Angular | Low | High |
| 113 | `@hexguard/angular-async-state` | `withPolling()` — periodic refresh with configurable interval | Angular | Medium | High |
| 114 | `@hexguard/angular-storage` | `withEncryption()` — client-side AES encryption for stored values | Angular | Medium | Medium |
| 115 | `HexGuard.Approvals` | `ApprovalDelegationRules` — auto-delegation on absence or timeout | .NET | Medium | High |
| 116 | `@hexguard/angular-approvals` | `approvalDueDateWarning` — computed overdue detection and escalation | Angular | Low | Medium |
| 117 | `HexGuard.EventBus` | `OutboxEventPublisher` — transactional outbox pattern integration | .NET | Medium | High |
| 118 | `@hexguard/angular-selection-state` | `shiftClickRange` — shift+click range selection across items | Angular | Medium | Medium |
| 119 | `HexGuard.Localization` | `EnumLocalizer` — auto-localize enum display names from resources | .NET | Low | High |
| 120 | `@hexguard/angular-data-grid` | `columnPersistence` — save/restore column config to localStorage | Angular | Low | High |
| 121 | `@hexguard/angular-url-state` | `canonicalSync()` — auto-set canonical URL from query state | Angular | Low | Medium |
| 122 | `@hexguard/angular-page-context` | `structuredData()` — inject JSON-LD from page context | Angular | Low | Medium |
| 123 | `HexGuard.AuditTrail` | `FieldDiffFormatter` — human-readable field change descriptions | .NET | Medium | High |
| 124 | `@hexguard/angular-audit-dashboard` | `complianceExport()` — pre-formatted audit report export | Angular | Low | High |
| 125 | `HexGuard.DataMasking` | `PiiAutoMask` — auto-detect and mask PII in responses | .NET | Medium | High |
| 126 | `@hexguard/angular-storage` | `gdprCompliant()` — automatic expiry + consent gating on stored data | Angular | Medium | High |
| 127 | `HexGuard.RequestLogging` | `ComplianceHeaders` — inject audit/compliance HTTP headers | .NET | Low | High |
| 128 | `@hexguard/angular-cookie-consent` | `consentVersionSync()` — auto-detect policy updates for re-consent | Angular | Low | High |
| 129 | `@hexguard/angular-invoice` | `invoiceTemplate` — configurable template fields for invoice display | Angular | Low | Medium |
| 130 | `@hexguard/angular-billing` | `usageSparkline` — computed usage trend data for sparkline charts | Angular | Low | Medium |
| 131 | `@hexguard/angular-ai-chat` | `tokenCostTracker` — real-time cost estimation during streaming | Angular | Medium | High |
| 132 | `@hexguard/angular-signature` | `signatureAuditTrail` — immutable signature event log per session | Angular | Low | High |
| 133 | `HexGuard.Invoicing` | `RecurringInvoice` — auto-generate invoices on configurable schedule | .NET | Medium | High |
| 134 | `HexGuard.Billing` | `UsageAnomalyDetection` — detect unusual usage spikes | .NET | Medium | High |
| 135 | `@hexguard/angular-media-library` | `cropTool` — image crop coordinates and aspect ratio state | Angular | Medium | Medium |
| 136 | `HexGuard.Sla` | `SlaCreditAutoCalculate` — automatic credit computation on breach | .NET | Low | High |
| 137 | `@hexguard/angular-inventory` | `barcodeLookup` — barcode scanning input state with camera/scan gun | Angular | Medium | Medium |
| 138 | `@hexguard/angular-pipeline` | `dealForecast` — weighted pipeline forecast with confidence bands | Angular | Low | High |
| 139 | `HexGuard.Inventory` | `FifoCosting` — FIFO-based inventory cost calculation | .NET | Medium | High |
| 140 | `HexGuard.Crm` | `DealStageAutomation` — auto-advance deals on key activity triggers | .NET | Medium | Medium |
| 141 | `@hexguard/angular-incidents` | `incidentBroadcast` — stakeholder notification composition state | Angular | Low | High |
| 142 | `HexGuard.Gamification` | `AchievementChains` — sequential badge unlock chains with prerequisites | .NET | Medium | High |
| 143 | `@hexguard/angular-badges` | `badgeShare` — social sharing state for earned achievements | Angular | Low | Medium |
| 144 | `HexGuard.WebhookSender` | `WebhookPayloadTemplates` — templated payload transformation per endpoint | .NET | Medium | High |
| 145 | `HexGuard.Blazor.LocalStorage` | `withEncryption()` — transparent AES-GCM encryption for stored values | Blazor | Medium | High |
| 146 | `HexGuard.Blazor.FileReader` | `chunkedRead()` — large file chunked streaming to avoid WASM memory pressure | Blazor | Medium | High |
| 147 | `HexGuard.Blazor.DebouncedInput` | `withSignalR()` — debounce input over SignalR circuit to reduce round-trips | Blazor | Low | High |
| 148 | `HexGuard.Blazor.Reactive` | `ObservableProperty` source generator — compile-time property wrapping | Blazor | Medium | High |
| 149 | `HexGuard.Blazor.JsInterop` | `modulePreloading` — preload JS modules before first invocation | Blazor | Low | Medium |
| 150 | `HexGuard.Blazor.PrerenderState` | `streamingState` — register state key before async operation completes | Blazor | Low | High |
| 151 | `HexGuard.Blazor.Offline` | `conflictResolver` — pluggable conflict resolution strategy per action type | Blazor | Medium | Medium |
| 152 | `HexGuard.Blazor.FormHelpers` | `navigateAwayGuard` — unsaved changes confirmation on navigation | Blazor | Low | High |
| 153 | `HexGuard.Blazor.AuthBootstrap` | `multiTenantAuth()` — per-tenant auth configuration for SaaS | Blazor | Medium | High |
| 154 | `HexGuard.Blazor.HttpDefaults` | `apiVersioning()` — version header + deprecation awareness | Blazor | Low | Medium |
| 155 | `HexGuard.Blazor.AppShell` | `announcements()` — app-wide announcement banner state | Blazor | Low | Medium |
| 156 | `HexGuard.Blazor.PwaSetup` | `backgroundSync()` — register periodic background sync tasks | Blazor | Medium | Medium |
| 157 | `HexGuard.Blazor.LoggingSetup` | `sensitiveDataMasking()` — auto-mask PII/SPI in log output | Blazor | Medium | High |
| 158 | `HexGuard.Blazor.ErrorSetup` | `errorReporting()` — Sentry/AppInsights integration adapter | Blazor | Low | High |
| 159 | `HexGuard.Blazor.DevTools` | `performanceBudget()` — warn on excessive component re-renders | Blazor | Low | Medium |
| 160 | `HexGuard.Blazor.RenderMode` | `autoModeStrategy()` — pre-load WASM assembly in background during SSR | Blazor | Medium | High |
