---
id: feature-blazor-markdown
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Blazor.Markdown
---

# HexGuard.Blazor.Markdown

## Summary

Markdown rendering component for Blazor with sanitization and syntax highlighting class generation.

## Proposed Public API

```csharp
@* MarkdownViewer.razor *@
public partial class MarkdownViewer
{
    [Parameter] public string? Content { get; set; }
    [Parameter] public bool Sanitize { get; set; } = true;
    [Parameter] public string LinkTarget { get; set; } = "_blank";
    [Parameter] public bool Gfm { get; set; } = true;

    // Renders as HTML: <div class="markdown">@((MarkupString)html)</div>
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.Markdown/` Razor class library.
2. Implement parser + renderer + sanitization.
3. Test with bUnit.
4. Publish as NuGet.
