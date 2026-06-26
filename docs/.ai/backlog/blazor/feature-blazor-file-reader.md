---
id: feature-blazor-file-reader
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Blazor.FileReader
---

# HexGuard.Blazor.FileReader

## Summary

FileReader state for Blazor WASM — read files as text/DataURL/ArrayBuffer via JS interop. Blazor counterpart to `@hexguard/angular-file-reader`.

## Proposed Public API

```csharp
public sealed class FileReaderService : IAsyncDisposable
{
    public bool IsReading { get; private set; }
    public double Progress { get; private set; }    // 0–1
    public event Action? OnChanged;

    public Task<string> ReadAsTextAsync(string base64, string encoding = "UTF-8");
    public Task<string> ReadAsDataUrlAsync(string base64);
    public Task<byte[]> ReadAsArrayBufferAsync(string base64);
    public void Cancel();
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.FileReader/` Razor class library.
2. Implement via `IJSRuntime` wrapping FileReader API.
3. Test with bUnit + mocked IJSRuntime.
4. Publish as NuGet.
