---
id: feature-dotnet-image-processing
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.ImageProcessing
---

# HexGuard.ImageProcessing

## Summary

Server-side image processing helpers — resize, crop, format conversion, and EXIF metadata extraction. Every app with user avatars, product images, or content uploads needs server-side image processing.

**Competition check:** `SkiaSharp` and `SixLabors.ImageSharp` are lower-level libraries. This is a thin, opinionated helper layer on top.

## Proposed Public API

```csharp
public interface IImageProcessor
{
    Task<Stream> ResizeAsync(Stream input, int width, int height,
        ImageFormat format, CancellationToken ct = default);
    Task<Stream> CropAsync(Stream input, int x, int y, int width, int height,
        CancellationToken ct = default);
    Task<Stream> ConvertFormatAsync(Stream input, ImageFormat target,
        CancellationToken ct = default);
    Task<ImageMetadata?> GetMetadataAsync(Stream input,
        CancellationToken ct = default);
}

public enum ImageFormat { Jpeg, Png, WebP, Gif, Bmp }

public sealed record ImageMetadata
{
    public int Width { get; init; }
    public int Height { get; init; }
    public string? Format { get; init; }
    public long SizeBytes { get; init; }
    public Dictionary<string, string> Exif { get; init; } = [];
}

// Registration
builder.Services.AddImageProcessing();
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.ImageProcessing/`.
2. Implement resize/crop/convert using ImageSharp.
3. Implement metadata extraction.
4. Add tests.
5. Register in `HexGuard.slnx`.
6. Publish as NuGet.
