---
id: feature-blazor-file-picker
type: feature
status: proposed
created: 2026-06-25
package: HexGuard.Blazor.FilePicker
---

# HexGuard.Blazor.FilePicker

## Summary

Headless file-selection state for Blazor WebAssembly — programmatic file picker invocation, drag-and-drop zone state, type/size validation, and signal-based file metadata. Every Blazor app with file uploads needs file selection and validation logic; without a package, developers write the same `IJSRuntime` interop and validation patterns repeatedly.

**Angular counterpart:** `@hexguard/angular-file-picker`

**Competition check (NuGet):** Zero headless file-picker packages exist for Blazor. Some upload libraries include file selection but bundle it with upload logic, styling, and UI.

## Why Wide Adoption

File upload (images, documents, CSV imports) appears in virtually every business app. Developers must: invoke the hidden `<input type=file>`, validate type/size client-side, read file metadata, and build a drag-and-drop zone. A headless wrapper removes this boilerplate.

## Goals

1. Provide `FilePickerService` with `PickAsync()` — programmatic file selection via hidden input or drag-and-drop.
2. Provide `DragDropZone` component — wraps `@ondragover`/`@ondrop` and outputs selected files.
3. Validate selected files against accepted MIME types and max size.
4. Expose selected files as `IReadOnlyList<FileInfo>` with name, size, type, lastModified.
5. Expose `ValidationError` string when files fail validation.
6. Support `Multiple` mode for batch selection.
7. WASM-only — no Server mode support for file DOM APIs.

## Non-Goals

- No upload logic or progress tracking (compose with upload/HTTP services).
- No file reading or preview (consumer calls `ReadAsDataUrlAsync` etc.).
- No image cropping or client-side processing.

## Decisions

1. **WASM-first**: Relies on browser File API via `IJSRuntime`. Server mode throws `PlatformNotSupportedException`.
2. **JS interop**: A small `filePicker.js` module handles invoking the hidden file input and reading `File` metadata.
3. **ElementReference-based**: The hidden input is an `ElementReference` managed internally.

## Proposed Public API

```csharp
// ── Models ────────────────────────────────────────────────

public sealed record FileInfo
{
    public string Name { get; init; }
    public long SizeBytes { get; init; }
    public string ContentType { get; init; }
    public DateTime LastModified { get; init; }
}

public sealed record FilePickerOptions
{
    public string[] AcceptedTypes { get; init; } = [];      // e.g. ["image/png", "image/jpeg"]
    public long MaxSizeBytes { get; init; } = 10 * 1024 * 1024;
    public bool Multiple { get; init; } = false;
}

// ── Service ───────────────────────────────────────────────

public sealed class FilePickerService : IAsyncDisposable
{
    public IReadOnlyList<FileInfo> SelectedFiles { get; private set; }
    public string? ValidationError { get; private set; }
    public bool HasFiles => SelectedFiles.Count > 0;
    public bool HasError => ValidationError is not null;
    public event Action? OnChange;

    public Task PickAsync(FilePickerOptions? options = null);
    public Task HandleDropAsync(IReadOnlyList<FileInfo> files);
    public void Clear();
}

// ── Component ─────────────────────────────────────────────

@* DragDropZone.razor *@
public partial class DragDropZone : IDisposable
{
    [Parameter] public RenderFragment? ChildContent { get; set; }
    [Parameter] public EventCallback<IReadOnlyList<FileInfo>> OnFilesDropped { get; set; }
    [Parameter] public string? AcceptedTypes { get; set; }
    [Parameter] public long MaxSizeBytes { get; set; } = 10 * 1024 * 1024;

    // State
    public bool IsDragOver { get; private set; }
}

// ── Registration ──────────────────────────────────────────

builder.Services.AddScoped<FilePickerService>();

// ── Usage ─────────────────────────────────────────────────

@inject FilePickerService Picker

<button @onclick="PickFiles">Select Files</button>

@if (Picker.HasError)
{
    <div class="error">@Picker.ValidationError</div>
}

<ul>
    @foreach (var file in Picker.SelectedFiles)
    {
        <li>@file.Name (@file.SizeBytes bytes)</li>
    }
</ul>

@code {
    private async Task PickFiles()
    {
        await Picker.PickAsync(new() {
            AcceptedTypes = ["image/png", "image/jpeg"],
            MaxSizeBytes = 5 * 1024 * 1024
        });
    }
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.FilePicker/` with Razor class library `.csproj`.
2. Create `filePicker.js` module for file input invocation and metadata reading.
3. Implement `FileInfo` record, `FilePickerOptions` record.
4. Implement `FilePickerService` with validation and state.
5. Implement `DragDropZone.razor` component.
6. Add WASM-only guard.
7. Create test project with bUnit + mocked `IJSRuntime`.
8. Publish as NuGet package `HexGuard.Blazor.FilePicker`.
