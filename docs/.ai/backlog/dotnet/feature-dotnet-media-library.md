---
id: feature-dotnet-media-library
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.MediaLibrary'
---

# HexGuard.MediaLibrary

## Summary

Digital Asset Management (DAM) backend for .NET — asset storage, metadata, tagging, folder organization, and usage tracking. Backend for CMS media pickers and brand asset management.

## Goals

- Asset upload with metadata extraction (dimensions, EXIF, duration)
- Folder/category organization with nesting
- Tag management per asset
- Search by filename, tags, metadata, content type
- Thumbnail generation for images and videos
- Asset versioning (keep previous versions)
- Usage tracking (which entities reference this asset)
- Access control per folder
- CDN URL generation with image transforms (resize, crop, format)

## Non-Goals

- No image recognition or AI tagging
- No video transcoding (delegate to external service)
- No UI rendering

## Proposed Public API

```csharp
public interface IMediaLibraryService
{
    Task<MediaAsset> UploadAsync(Stream content, string filename, UploadOptions? options = null, CancellationToken ct = default);
    Task<MediaAsset?> GetAsync(string assetId, CancellationToken ct = default);
    Task<IReadOnlyList<MediaAsset>> QueryAsync(MediaQuery query, CancellationToken ct = default);
    Task<MediaAsset> UpdateAsync(string assetId, UpdateAssetRequest request, CancellationToken ct = default);
    Task DeleteAsync(string assetId, CancellationToken ct = default);
    Task<IReadOnlyList<MediaAsset>> BulkDeleteAsync(IReadOnlyList<string> assetIds, CancellationToken ct = default);
    Task<IReadOnlyList<MediaAsset>> MoveAsync(IReadOnlyList<string> assetIds, string folderId, CancellationToken ct = default);
    // Folders
    Task<MediaFolder> CreateFolderAsync(CreateFolderRequest request, CancellationToken ct = default);
    Task<IReadOnlyList<MediaFolder>> GetFoldersAsync(string? parentId = null, CancellationToken ct = default);
    // Usage
    Task<IReadOnlyList<AssetUsage>> GetUsageAsync(string assetId, CancellationToken ct = default);
}

public sealed record UploadOptions(
    string? FolderId = null,
    IReadOnlyList<string>? Tags = null,
    bool ExtractMetadata = true,
    bool GenerateThumbnails = true
);

public sealed record MediaQuery(
    string? FolderId = null,
    MediaType? Type = null,
    IReadOnlyList<string>? Tags = null,
    string? Search = null,
    int Skip = 0,
    int Take = 50
);

public sealed record AssetUsage(string EntityType, string EntityId, string FieldName);
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.MediaLibrary/` with `.csproj`.
2. Implement upload, metadata extraction, folder management, search, versioning.
3. Add thumbnail generation and CDN URL helpers.
4. Add xunit tests. Register in `HexGuard.slnx`.
