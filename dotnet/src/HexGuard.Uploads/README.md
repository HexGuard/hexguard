# HexGuard.Uploads

Upload session management for .NET — `UploadSession` model, `IUploadStore` abstraction, and Minimal API endpoints.

## Installation

```bash
dotnet add package HexGuard.Uploads
```

## Quick Start

### 1. Register the store

```csharp
using HexGuard.Uploads;

builder.Services.AddUploadStore<InMemoryUploadStore>();
```

### 2. Map upload endpoints

```csharp
using HexGuard.Uploads;

app.MapPost("/api/uploads", async (HttpRequest request, IUploadStore store) =>
{
    if (!request.HasFormContentType)
        return Results.BadRequest();

    var file = request.Form.Files.FirstOrDefault();
    if (file is null)
        return Results.BadRequest();

    var session = UploadSession.Create(
        file.FileName, file.Length, file.ContentType);

    await store.CreateAsync(session);
    return Results.Ok(session);
});

app.MapGet("/api/uploads/{id:guid}", async (Guid id, IUploadStore store) =>
{
    var session = await store.GetAsync(id);
    return session is not null ? Results.Ok(session) : Results.NotFound();
});

app.MapDelete("/api/uploads/{id:guid}", async (Guid id, IUploadStore store) =>
{
    var session = await store.GetAsync(id);
    if (session is null) return Results.NotFound();

    var cancelled = session with { Status = UploadSessionStatus.Cancelled };
    await store.UpdateAsync(cancelled);
    await store.DeleteAsync(id);
    return Results.Ok(cancelled);
});
```

## API Reference

| Type                  | Description                                                    |
| --------------------- | -------------------------------------------------------------- |
| `UploadSession`       | Record with SessionId, FileName, FileSize, ContentType, Status |
| `UploadSessionStatus` | Enum: Uploading, Processing, Completed, Failed, Cancelled      |
| `IUploadStore`        | Interface: CreateAsync, GetAsync, UpdateAsync, DeleteAsync     |
| `InMemoryUploadStore` | In-memory store using `ConcurrentDictionary`                   |
| `UploadsExtensions`   | Extension methods for DI registration and endpoint mapping     |

## Cross-Stack Pairing

Pairs with `@hexguard/angular-upload-state` for client-side signal-based upload queue with progress tracking, cancellation, and retry.
