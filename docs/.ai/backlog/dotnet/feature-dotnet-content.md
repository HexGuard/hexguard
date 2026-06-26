---
id: feature-dotnet-content
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Content
---

# HexGuard.Content

## Summary

Content management engine — content type definitions, draft/published/archived/scheduled, versioning, auto-publish scheduler. Pairs with `@hexguard/angular-content`.

## Proposed Public API

```csharp
public enum ContentStatus { Draft, Published, Archived, Scheduled }

public interface IContentStore
{
    Task<ContentEntry> CreateAsync(string contentTypeId, JsonDocument data, CancellationToken ct);
    Task<ContentEntry> UpdateAsync(string id, JsonDocument data, CancellationToken ct);
    Task<ContentEntry> PublishAsync(string id, CancellationToken ct);
    Task<ContentEntry> SchedulePublishAsync(string id, DateTime publishAt, CancellationToken ct);
    Task<ContentEntry> ArchiveAsync(string id, CancellationToken ct);
    Task<IReadOnlyList<ContentEntry>> GetVersionsAsync(string id, CancellationToken ct);
    Task<ContentEntry> RestoreVersionAsync(string id, int version, CancellationToken ct);
}

builder.Services.AddContentStore<AppDbContext, EfCoreContentStore>();
builder.Services.AddHostedService<ContentScheduler>();
app.MapContentApi("/api/content");
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Content/`.
2. Implement content models, `IContentStore`, EF Core store.
3. Implement content scheduler.
4. Add auto-mapped API endpoints.
5. Add tests.
6. Register in `HexGuard.slnx`.
7. Publish as NuGet.
