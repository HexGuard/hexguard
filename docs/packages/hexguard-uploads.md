# HexGuard.Uploads

Upload session management for .NET APIs. Paired with `@hexguard/angular-upload-state` for cross-stack file upload lifecycle management.

## Feature Matrix

| Capability                   | Status       | Notes                                                         |
| ---------------------------- | ------------ | ------------------------------------------------------------- |
| `UploadSession` record       | ✅ Available | `SessionId`, `FileName`, `FileSize`, `ContentType`, `Status`   |
| `UploadSessionStatus` enum   | ✅ Available | `Uploading`, `Processing`, `Completed`, `Failed`, `Cancelled` |
| `IUploadStore` interface     | ✅ Available | CRUD abstraction for upload sessions                          |
| `InMemoryUploadStore`        | ✅ Available | `ConcurrentDictionary<Guid, UploadSession>` implementation    |
| Minimal API endpoints        | ✅ Available | Create, poll status, cancel                                   |
| Sample API endpoints         | ✅ Available | `/api/uploads/sample-files` (GET), `/api/uploads/` (POST)     |
| Cross-stack pairing          | ✅ Available | `@hexguard/angular-upload-state`                              |

## Public API Map

| Type                 | Kind            | Role                                                   |
| -------------------- | --------------- | ------------------------------------------------------ |
| `UploadSession`      | `sealed record` | Upload session with status, metadata, and timestamps   |
| `UploadSessionStatus`| `enum`          | Lifecycle states: Uploading → Processing → Completed    |
| `IUploadStore`       | `interface`     | `CreateAsync`, `GetAsync`, `UpdateAsync`, `DeleteAsync` |
| `InMemoryUploadStore`| `class`         | In-memory implementation using `ConcurrentDictionary`  |
| `UploadsExtensions`  | `class`         | DI registration `AddUploadStore()` + endpoint mapping   |

## Sample API Endpoints

| Endpoint              | Method | Description                        |
| --------------------- | ------ | ---------------------------------- |
| `/api/uploads/sample-files` | GET    | List sample file names with sizes  |
| `/api/uploads/`       | POST   | Receive file, return upload session |
| `/api/uploads/{id}`   | GET    | Poll upload session status         |
| `/api/uploads/{id}`   | DELETE | Cancel upload and clean up         |

## Code Examples

### Register upload store

```csharp
using HexGuard.Uploads;

builder.Services.AddUploadStore<InMemoryUploadStore>();
```

### Create upload session endpoint

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
```

### Poll upload status

```csharp
app.MapGet("/api/uploads/{id:guid}", async (Guid id, IUploadStore store) =>
{
    var session = await store.GetAsync(id);
    return session is not null
        ? Results.Ok(session)
        : Results.NotFound();
});
```

### Cancel upload

```csharp
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

## Cross-Stack Pairing

`HexGuard.Uploads` pairs with `@hexguard/angular-upload-state` for end-to-end upload lifecycle:

- **Server** (`HexGuard.Uploads`): Manages upload sessions — create, poll status, cancel. Store abstraction allows swapping InMemory for a persistent store.
- **Client** (`@hexguard/angular-upload-state`): Signal-based upload queue with per-file progress, overall progress, cancel, retry, and clear operations.
