---
id: feature-dotnet-media
type: feature
status: proposed
created: 2026-06-27
package: HexGuard.Media
---

# HexGuard.Media

## Summary

Media upload pipeline — upload → validate → process (resize, transcode) → store (local, S3, Azure Blob) → serve with CDN URLs. End-to-end media management for user avatars, product images, document uploads.

**Composes with** `HexGuard.ImageProcessing` for transformations.

## Proposed Public API

```csharp
public interface IMediaService
{
    Task<MediaFile> UploadAsync(Stream content, string fileName, string contentType, MediaOptions? options = null, CancellationToken ct = default);
    Task<MediaFile?> GetAsync(string fileId, CancellationToken ct);
    Task<Stream> DownloadAsync(string fileId, string? variant = null, CancellationToken ct = default);
    Task DeleteAsync(string fileId, CancellationToken ct);
    Task<string> GetPublicUrlAsync(string fileId, string? variant = null);
}

public sealed record MediaOptions { int? MaxWidth; int? MaxHeight; MediaVariant[]? Variants; }

builder.Services.AddMedia(options => {
    options.Storage = MediaStorage.AzureBlob;
    options.ConnectionString = config["Storage:ConnectionString"];
    options.CdnBaseUrl = "https://cdn.myapp.com";
});
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Media/`.
2. Implement upload pipeline, processing, storage adapters (local/S3/Azure), CDN URL generation.
3. Add tests. Register in `HexGuard.slnx`. Publish as NuGet.
