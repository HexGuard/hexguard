---
id: feature-blazor-markdown
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Blazor.Markdown
---

# HexGuard.Blazor.Markdown

## Summary

Markdown-to-HTML rendering service for Blazor — sanitized HTML output with configurable options. **Headless service** — returns a string; consumers render the `MarkupString` in their own components.

## Proposed Public API

```csharp
public sealed class MarkdownService
{
    public MarkdownOptions Options { get; set; } = new();

    public string Render(string markdown);
    public string RenderInline(string markdown);
}

public sealed record MarkdownOptions
{
    public bool Sanitize { get; set; } = true;
    public string LinkTarget { get; set; } = "_blank";
    public string LinkRel { get; set; } = "noopener noreferrer";
    public bool Gfm { get; set; } = true;
}

// Usage — consumer renders the result:
// <div>@((MarkupString)_markdown.Render(content))</div>
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.Markdown/` Razor class library.
2. Implement parser + renderer + sanitization as a service.
3. Test with bUnit.
4. Publish as NuGet.

